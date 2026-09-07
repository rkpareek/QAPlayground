import { StoredUser, UserProfile, MockApiResponse, ApiSessionState } from './types';
import { INITIAL_USERS } from './data/initialUsers';

const STORAGE_KEY = 'qa_apis_playground_session_v1';

export class MockServer {
  private static getState(): ApiSessionState {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }

    const defaultState: ApiSessionState = {
      users: [...INITIAL_USERS],
      activeToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSIsImVtYWlsIjoiYWxleC5tb3JnYW5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.sig_sample_jwt_token',
      activeUser: { ...INITIAL_USERS[0] },
      lastResetToken: null,
      lastResetEmail: null,
      lastResetCode: null,
    };
    MockServer.saveState(defaultState);
    return defaultState;
  }

  private static saveState(state: ApiSessionState): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore in sandbox restrictions
    }
  }

  public static getSession(): ApiSessionState {
    return MockServer.getState();
  }

  public static resetSession(): ApiSessionState {
    const defaultState: ApiSessionState = {
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      activeToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSIsImVtYWlsIjoiYWxleC5tb3JnYW5AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.sig_sample_jwt_token',
      activeUser: { ...INITIAL_USERS[0] },
      lastResetToken: null,
      lastResetEmail: null,
      lastResetCode: null,
    };
    MockServer.saveState(defaultState);
    return defaultState;
  }

  public static setActiveToken(token: string | null): void {
    const state = MockServer.getState();
    state.activeToken = token;
    if (!token) {
      state.activeUser = null;
    }
    MockServer.saveState(state);
  }

  public static clearSessionAuth(): void {
    const state = MockServer.getState();
    state.activeToken = null;
    state.activeUser = null;
    MockServer.saveState(state);
  }

  // Helper to extract clean bearer token and find corresponding user
  private static authenticate(headers: Record<string, string>, state: ApiSessionState): { user: StoredUser | null; error: string | null } {
    const authHeader = Object.keys(headers).find(k => k.toLowerCase() === 'authorization');
    const headerVal = authHeader ? headers[authHeader].trim() : '';

    if (!headerVal) {
      return { user: null, error: 'Missing Authorization header. An access token is required.' };
    }

    if (!headerVal.startsWith('Bearer ')) {
      return { user: null, error: 'Malformed Authorization header. Format must be "Bearer <token>".' };
    }

    const token = headerVal.substring(7).trim();
    if (!token || token.length < 10) {
      return { user: null, error: 'Invalid or expired token provided.' };
    }

    // Check if token contains a user uid in demo or matches active session
    let matchedUser: StoredUser | undefined;
    if (state.activeUser) {
      matchedUser = state.users.find(u => u.uid === state.activeUser?.uid);
    }
    if (!matchedUser) {
      // Find matching user from token if encoded or default to first
      matchedUser = state.users.find(u => token.includes(u.uid)) || state.users[0];
    }

    if (!matchedUser) {
      return { user: null, error: 'User associated with this token no longer exists.' };
    }

    return { user: matchedUser, error: null };
  }

  public static async execute(
    endpointId: string,
    method: string,
    url: string,
    headers: Record<string, string>,
    body: any,
    params: Record<string, string> = {}
  ): Promise<MockApiResponse> {
    // Simulated realistic network latency between 90ms and 220ms
    const latency = Math.floor(Math.random() * 130) + 90;
    await new Promise(resolve => setTimeout(resolve, latency));

    const state = MockServer.getState();
    const timestamp = new Date().toISOString();

    const baseResponse = (status: number, statusText: string, resBody: any): MockApiResponse => ({
      status,
      statusText,
      latencyMs: latency,
      timestamp,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-mock-server': 'MockAPI-Sandbox-v1',
        'x-rate-limit-remaining': '99',
        date: new Date().toUTCString(),
      },
      body: resBody,
      requestSent: {
        method,
        url,
        headers,
        body,
      },
    });

    switch (endpointId) {
      /* ========================================================================
       * 1. Register User
       * ======================================================================== */
      case 'register-user': {
        const { email, username, password, firstname, lastname, gender, age } = body || {};

        if (!email || !username || !password || !firstname || !lastname || !gender || age === undefined) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'VALIDATION_ERROR',
            message: 'All fields are mandatory: email, username, password, firstname, lastname, gender, age.',
            missingFields: [
              !email && 'email',
              !username && 'username',
              !password && 'password',
              !firstname && 'firstname',
              !lastname && 'lastname',
              !gender && 'gender',
              age === undefined && 'age',
            ].filter(Boolean),
          });
        }

        // Email format validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'INVALID_EMAIL_FORMAT',
            message: 'Please provide a valid email address.',
          });
        }

        // Age boundary validation
        const parsedAge = Number(age);
        if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'INVALID_AGE',
            message: 'Age must be a valid number between 13 and 120.',
          });
        }

        // Duplicate checks
        const existingEmail = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingEmail) {
          return baseResponse(409, 'Conflict', {
            success: false,
            error: 'EMAIL_ALREADY_EXISTS',
            message: `The email '${email}' is already registered in the system.`,
          });
        }

        const existingUsername = state.users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (existingUsername) {
          return baseResponse(409, 'Conflict', {
            success: false,
            error: 'USERNAME_TAKEN',
            message: `The username '${username}' is already taken. Please select another.`,
          });
        }

        const newUid = `usr_${Math.random().toString(36).substring(2, 7)}${Math.floor(Math.random() * 90 + 10)}`;
        const newUser: StoredUser = {
          uid: newUid,
          email: email.trim().toLowerCase(),
          username: username.trim(),
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          gender,
          age: parsedAge,
          passwordHash: password,
          createdAt: timestamp,
        };

        state.users.push(newUser);
        MockServer.saveState(state);

        const safeProfile: UserProfile = {
          uid: newUser.uid,
          email: newUser.email,
          username: newUser.username,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          gender: newUser.gender,
          age: newUser.age,
          createdAt: newUser.createdAt,
        };

        return baseResponse(201, 'Created', {
          success: true,
          message: 'User registered successfully',
          user: safeProfile,
        });
      }

      /* ========================================================================
       * 2. Login
       * ======================================================================== */
      case 'login-user': {
        const usernameOrEmail = (body?.usernameOrEmail || body?.email || body?.username || '').trim();
        const password = body?.password;

        if (!usernameOrEmail || !password) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'CREDENTIALS_REQUIRED',
            message: 'Both username/email and password must be supplied in the request body.',
          });
        }

        const foundUser = state.users.find(
          u => u.email.toLowerCase() === usernameOrEmail.toLowerCase() ||
               u.username.toLowerCase() === usernameOrEmail.toLowerCase()
        );

        if (!foundUser || foundUser.passwordHash !== password) {
          return baseResponse(401, 'Unauthorized', {
            success: false,
            error: 'INVALID_CREDENTIALS',
            message: 'Invalid email/username or incorrect password.',
          });
        }

        // Generate mock signed JWT
        const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
          JSON.stringify({ uid: foundUser.uid, email: foundUser.email, iat: Math.floor(Date.now() / 1000) })
        )}.sig_${Math.random().toString(36).substring(2, 10)}`;

        const userProfile: UserProfile = {
          uid: foundUser.uid,
          email: foundUser.email,
          username: foundUser.username,
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          gender: foundUser.gender,
          age: foundUser.age,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        };

        // Update active session state
        state.activeToken = token;
        state.activeUser = userProfile;
        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'Authentication successful',
          token,
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: userProfile,
        });
      }

      /* ========================================================================
       * 3. Forgot Password
       * ======================================================================== */
      case 'forgot-password': {
        const email = (body?.email || '').trim().toLowerCase();

        if (!email) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'EMAIL_REQUIRED',
            message: 'Field "email" is required.',
          });
        }

        const targetUser = state.users.find(u => u.email.toLowerCase() === email);
        if (!targetUser) {
          return baseResponse(404, 'Not Found', {
            success: false,
            error: 'USER_NOT_FOUND',
            message: `No account registered with the email: ${email}`,
          });
        }

        const resetToken = `rst_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 8)}`;
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        state.lastResetToken = resetToken;
        state.lastResetEmail = email;
        state.lastResetCode = resetCode;
        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'Password reset token generated successfully.',
          resetToken,
          resetCode,
          email,
          expiresIn: '15 minutes',
          instructions: 'Supply this resetToken or resetCode into /api/v1/auth/reset-password together with your new password.',
        });
      }

      /* ========================================================================
       * 4. Reset Password
       * ======================================================================== */
      case 'reset-password': {
        const { email, resetToken, resetCode, newPassword } = body || {};

        if (!email || (!resetToken && !resetCode) || !newPassword) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'MISSING_FIELDS',
            message: 'email, resetToken (or resetCode), and newPassword are required.',
          });
        }

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'WEAK_PASSWORD',
            message: 'newPassword must be at least 6 characters in length.',
          });
        }

        const cleanEmail = email.trim().toLowerCase();
        const targetUser = state.users.find(u => u.email.toLowerCase() === cleanEmail);

        if (!targetUser) {
          return baseResponse(404, 'Not Found', {
            success: false,
            error: 'USER_NOT_FOUND',
            message: `Account not found for email: ${email}`,
          });
        }

        // Validate reset token
        const tokenMatch = (resetToken && resetToken === state.lastResetToken) || (resetCode && resetCode === state.lastResetCode);
        if (!tokenMatch || state.lastResetEmail !== cleanEmail) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'INVALID_RESET_TOKEN',
            message: 'Invalid, expired, or mismatched password reset token for this email address. Please generate a new one via /api/v1/auth/forgot-password.',
          });
        }

        // Update password in storage
        targetUser.passwordHash = newPassword;
        targetUser.updatedAt = timestamp;
        state.lastResetToken = null;
        state.lastResetCode = null;
        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'Password has been successfully reset! You can now log in with your new password.',
          email: targetUser.email,
        });
      }

      /* ========================================================================
       * 5. Change Password (Token Required)
       * ======================================================================== */
      case 'change-password': {
        const auth = MockServer.authenticate(headers, state);
        if (auth.error || !auth.user) {
          return baseResponse(401, 'Unauthorized', {
            success: false,
            error: 'UNAUTHORIZED',
            message: auth.error || 'Authentication token is required to change password.',
          });
        }

        const { oldPassword, newPassword } = body || {};
        if (!oldPassword || !newPassword) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'MISSING_FIELDS',
            message: 'Both oldPassword and newPassword are required.',
          });
        }

        if (auth.user.passwordHash !== oldPassword) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'INCORRECT_OLD_PASSWORD',
            message: 'The current oldPassword provided is incorrect.',
          });
        }

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'WEAK_PASSWORD',
            message: 'newPassword must be at least 6 characters in length.',
          });
        }

        auth.user.passwordHash = newPassword;
        auth.user.updatedAt = timestamp;
        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'Password updated successfully.',
          uid: auth.user.uid,
          updatedAt: timestamp,
        });
      }

      /* ========================================================================
       * 6. Get Profile (Token Required)
       * ======================================================================== */
      case 'get-profile': {
        const auth = MockServer.authenticate(headers, state);
        if (auth.error || !auth.user) {
          return baseResponse(401, 'Unauthorized', {
            success: false,
            error: 'UNAUTHORIZED',
            message: auth.error || 'Access token required to retrieve user profile.',
          });
        }

        const safeProfile: UserProfile = {
          uid: auth.user.uid,
          email: auth.user.email,
          username: auth.user.username,
          firstname: auth.user.firstname,
          lastname: auth.user.lastname,
          gender: auth.user.gender,
          age: auth.user.age,
          createdAt: auth.user.createdAt,
          updatedAt: auth.user.updatedAt,
        };

        return baseResponse(200, 'OK', {
          success: true,
          user: safeProfile,
        });
      }

      /* ========================================================================
       * 7. Update Profile (Token Required)
       * ======================================================================== */
      case 'update-profile': {
        const auth = MockServer.authenticate(headers, state);
        if (auth.error || !auth.user) {
          return baseResponse(401, 'Unauthorized', {
            success: false,
            error: 'UNAUTHORIZED',
            message: auth.error || 'Access token required to update user profile.',
          });
        }

        const { firstname, lastname, gender, age, username } = body || {};

        if (username && username.trim().toLowerCase() !== auth.user.username.toLowerCase()) {
          const duplicate = state.users.find(
            u => u.uid !== auth.user!.uid && u.username.toLowerCase() === username.trim().toLowerCase()
          );
          if (duplicate) {
            return baseResponse(409, 'Conflict', {
              success: false,
              error: 'USERNAME_TAKEN',
              message: `Username '${username}' is already in use by another account.`,
            });
          }
          auth.user.username = username.trim();
        }

        if (firstname) auth.user.firstname = firstname.trim();
        if (lastname) auth.user.lastname = lastname.trim();
        if (gender) auth.user.gender = gender;
        if (age !== undefined) {
          const parsedAge = Number(age);
          if (!isNaN(parsedAge) && parsedAge >= 13 && parsedAge <= 120) {
            auth.user.age = parsedAge;
          }
        }
        auth.user.updatedAt = timestamp;

        if (state.activeUser && state.activeUser.uid === auth.user.uid) {
          state.activeUser = {
            uid: auth.user.uid,
            email: auth.user.email,
            username: auth.user.username,
            firstname: auth.user.firstname,
            lastname: auth.user.lastname,
            gender: auth.user.gender,
            age: auth.user.age,
            createdAt: auth.user.createdAt,
            updatedAt: auth.user.updatedAt,
          };
        }

        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'Profile updated successfully.',
          user: {
            uid: auth.user.uid,
            email: auth.user.email,
            username: auth.user.username,
            firstname: auth.user.firstname,
            lastname: auth.user.lastname,
            gender: auth.user.gender,
            age: auth.user.age,
            createdAt: auth.user.createdAt,
            updatedAt: auth.user.updatedAt,
          },
        });
      }

      /* ========================================================================
       * 8. List Users
       * ======================================================================== */
      case 'list-users': {
        const search = (params?.search || '').toLowerCase();
        let list = state.users;

        if (search) {
          list = list.filter(
            u => u.username.toLowerCase().includes(search) ||
                 u.email.toLowerCase().includes(search) ||
                 u.firstname.toLowerCase().includes(search) ||
                 u.lastname.toLowerCase().includes(search)
          );
        }

        const safeUsers: UserProfile[] = list.map(u => ({
          uid: u.uid,
          email: u.email,
          username: u.username,
          firstname: u.firstname,
          lastname: u.lastname,
          gender: u.gender,
          age: u.age,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }));

        return baseResponse(200, 'OK', {
          success: true,
          count: safeUsers.length,
          total: state.users.length,
          filter: search ? { search } : null,
          users: safeUsers,
        });
      }

      /* ========================================================================
       * 9. Delete User (Token Required)
       * ======================================================================== */
      case 'delete-user': {
        const auth = MockServer.authenticate(headers, state);
        if (auth.error || !auth.user) {
          return baseResponse(401, 'Unauthorized', {
            success: false,
            error: 'UNAUTHORIZED',
            message: auth.error || 'Access token required to delete a user account.',
          });
        }

        const targetUid = params?.uid || body?.uid;
        if (!targetUid) {
          return baseResponse(400, 'Bad Request', {
            success: false,
            error: 'UID_REQUIRED',
            message: 'User ID (uid) parameter is required to perform deletion.',
          });
        }

        const userIndex = state.users.findIndex(u => u.uid === targetUid);
        if (userIndex === -1) {
          return baseResponse(404, 'Not Found', {
            success: false,
            error: 'USER_NOT_FOUND',
            message: `User with uid '${targetUid}' does not exist.`,
          });
        }

        const deletedUser = state.users.splice(userIndex, 1)[0];

        // If active user was deleted, clear active session
        if (state.activeUser?.uid === targetUid) {
          state.activeUser = null;
          state.activeToken = null;
        }

        MockServer.saveState(state);

        return baseResponse(200, 'OK', {
          success: true,
          message: 'User deleted successfully.',
          deletedUid: deletedUser.uid,
          deletedEmail: deletedUser.email,
          remainingUsersCount: state.users.length,
        });
      }

      default:
        return baseResponse(404, 'Not Found', {
          success: false,
          error: 'ENDPOINT_NOT_FOUND',
          message: `Endpoint ${method} ${url} does not exist.`,
        });
    }
  }

  // Generates copyable curl command
  public static generateCurl(
    method: string,
    endpoint: string,
    headers: Record<string, string>,
    body?: any,
    params?: Record<string, string>
  ): string {
    let resolvedUrl = endpoint;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (resolvedUrl.includes(`{${k}}`)) {
          resolvedUrl = resolvedUrl.replace(`{${k}}`, encodeURIComponent(v));
        }
      });
    }

    // Add query params if method is GET and params exist
    if (method === 'GET' && params?.search) {
      resolvedUrl += `?search=${encodeURIComponent(params.search)}`;
    }

    const domain = 'https://api.qatoolshub.io';
    const lines: string[] = [`curl -X ${method} "${domain}${resolvedUrl}"`];

    Object.entries(headers).forEach(([k, v]) => {
      lines.push(`  -H "${k}: ${v}"`);
    });

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const jsonString = JSON.stringify(body, null, 2);
      lines.push(`  -d '${jsonString.replace(/'/g, "\\'")}'`);
    }

    return lines.join(' \\\n');
  }
}

import { ApiEndpointDef } from '../types';

export const API_ENDPOINTS: ApiEndpointDef[] = [
  /* ========================================================================
   * 1. Register User
   * ======================================================================== */
  {
    id: 'register-user',
    title: 'Register User',
    method: 'POST',
    endpoint: '/api/v1/users/register',
    category: 'Authentication',
    summary: 'Registers a new user account with complete demographic and credential fields.',
    description:
      'Creates a new user profile in the persistent session database. Validates email structure, age boundaries (13–120), and enforces uniqueness for both email and username.',
    requiresAuth: false,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    defaultBody: {
      email: 'clara.oswald@example.com',
      username: 'clarao',
      password: 'SecurePassword123!',
      firstname: 'Clara',
      lastname: 'Oswald',
      gender: 'Female',
      age: 26,
    },
    sampleResponse: {
      status: 201,
      statusText: 'Created',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'User registered successfully',
        user: {
          uid: 'usr_81a49',
          email: 'clara.oswald@example.com',
          username: 'clarao',
          firstname: 'Clara',
          lastname: 'Oswald',
          gender: 'Female',
          age: 26,
          createdAt: '2026-09-04T12:00:00.000Z',
        },
      },
    },
    learningNotes: {
      purpose: 'Verify that newly onboarded users are correctly validated, assigned a unique system UID, and saved to the database.',
      qaTestCases: [
        'Positive: Submit all required valid fields and verify HTTP 201 Created.',
        'Negative (Duplicate Email): Submit the same email twice to confirm 409 Conflict.',
        'Negative (Missing Fields): Omit firstname or age to verify 400 Bad Request with missing field list.',
        'Boundary Testing: Test age values like 12 (rejected) vs 13 (accepted), and non-numeric values.',
      ],
      commonErrors: [
        '400 Bad Request — Missing mandatory fields or malformed email format.',
        '409 Conflict — Duplicate email or username already in use.',
      ],
    },
  },

  /* ========================================================================
   * 2. Login
   * ======================================================================== */
  {
    id: 'login-user',
    title: 'Login (Authenticate)',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    category: 'Authentication',
    summary: 'Authenticates user credentials and returns a Bearer access token along with the user profile.',
    description:
      'Verifies username or email against stored password. Upon successful verification, generates a signed Bearer authentication token to use for protected endpoints.',
    requiresAuth: false,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    defaultBody: {
      usernameOrEmail: 'alex.morgan@example.com',
      password: 'Password123!',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'Authentication successful',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSIsImVtYWlsIjoiYWxleC5tb3JnYW5AZXhhbXBsZS5jb20ifQ.sig_sample_jwt_token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
          uid: 'usr_101a',
          email: 'alex.morgan@example.com',
          username: 'alexmorgan',
          firstname: 'Alex',
          lastname: 'Morgan',
          gender: 'Female',
          age: 28,
        },
      },
    },
    learningNotes: {
      purpose: 'Test user identity verification and examine token-based access control workflows.',
      qaTestCases: [
        'Positive (Email): Login using verified email and password.',
        'Positive (Username): Login using username (e.g. "alexmorgan") instead of email.',
        'Negative (Bad Password): Intentionally send incorrect password to assert HTTP 401 Unauthorized.',
        'Negative (Nonexistent User): Try logging in with a non-existent email.',
      ],
      commonErrors: [
        '400 Bad Request — Missing usernameOrEmail or password parameter.',
        '401 Unauthorized — Invalid credentials or incorrect password.',
      ],
    },
  },

  /* ========================================================================
   * 3. Forgot Password
   * ======================================================================== */
  {
    id: 'forgot-password',
    title: 'Forgot Password',
    method: 'POST',
    endpoint: '/api/v1/auth/forgot-password',
    category: 'Password Management',
    summary: 'Requests a time-bound password reset token and numeric verification code for an account.',
    description:
      'Simulates the password recovery initiation flow. Checks that the email exists and issues a temporary reset token and 6-digit verification code stored in session.',
    requiresAuth: false,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    defaultBody: {
      email: 'alex.morgan@example.com',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'Password reset token generated successfully.',
        resetToken: 'rst_7x9q2m_4a1e9',
        resetCode: '492018',
        email: 'alex.morgan@example.com',
        expiresIn: '15 minutes',
        instructions: 'Supply this resetToken or resetCode into /api/v1/auth/reset-password together with your new password.',
      },
    },
    learningNotes: {
      purpose: 'Understand how self-service account recovery tokens are issued and linked to target accounts.',
      qaTestCases: [
        'Positive: Send registered email and extract generated resetToken / resetCode.',
        'Negative: Send unknown email to verify 404 Not Found error handling.',
        'Negative: Send empty email to verify 400 Bad Request validation.',
      ],
      commonErrors: [
        '400 Bad Request — Email parameter missing.',
        '404 Not Found — Email not registered in the system.',
      ],
    },
  },

  /* ========================================================================
   * 4. Reset Password
   * ======================================================================== */
  {
    id: 'reset-password',
    title: 'Reset Password',
    method: 'POST',
    endpoint: '/api/v1/auth/reset-password',
    category: 'Password Management',
    summary: 'Consumes a valid reset token or code to set a new password without needing the old password.',
    description:
      'Validates that the provided reset token or numeric reset code matches the issued token for the email. Upon success, updates the password and revokes the reset token.',
    requiresAuth: false,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    defaultBody: {
      email: 'alex.morgan@example.com',
      resetToken: 'rst_example_token',
      newPassword: 'BrandNewPassword2026!',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'Password has been successfully reset! You can now log in with your new password.',
        email: 'alex.morgan@example.com',
      },
    },
    learningNotes: {
      purpose: 'Test token validation, expiration mechanics, and password strength policies during recovery.',
      qaTestCases: [
        'Positive: Use the active reset token generated by Forgot Password to change password, then test Login with new password.',
        'Negative (Tampered Token): Modify the resetToken string to verify 400 Bad Request with INVALID_RESET_TOKEN.',
        'Negative (Weak Password): Provide a password with fewer than 6 characters.',
        'Negative (Replay Attack): Try executing the reset API twice with the same token to verify one-time consumption.',
      ],
      commonErrors: [
        '400 Bad Request — Invalid or expired reset token, or weak new password.',
        '404 Not Found — Target email address not found.',
      ],
    },
  },

  /* ========================================================================
   * 5. Change Password (Token Required)
   * ======================================================================== */
  {
    id: 'change-password',
    title: 'Change Password',
    method: 'POST',
    endpoint: '/api/v1/auth/change-password',
    category: 'Password Management',
    summary: 'Allows an authenticated user to change their password by supplying their current password.',
    description:
      'Requires a valid Bearer token in the Authorization header. Verifies that oldPassword matches before replacing it with newPassword.',
    requiresAuth: true,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSJ9.sig_sample',
      Accept: 'application/json',
    },
    defaultBody: {
      oldPassword: 'Password123!',
      newPassword: 'UpdatedSecret2026!',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'Password updated successfully.',
        uid: 'usr_101a',
        updatedAt: '2026-09-04T12:05:00.000Z',
      },
    },
    learningNotes: {
      purpose: 'Test authenticated credential modification and authorization header validation.',
      qaTestCases: [
        'Positive: Provide valid Bearer token and correct oldPassword.',
        'Negative (No Token): Remove the Authorization header completely to verify 401 Unauthorized.',
        'Negative (Invalid Old Password): Provide wrong old password to test 400 Bad Request rejection.',
        'Negative (Identical Password): Test boundary handling for unchanged passwords.',
      ],
      commonErrors: [
        '401 Unauthorized — Missing or invalid Authorization header.',
        '400 Bad Request — Incorrect old password or new password too short.',
      ],
    },
  },

  /* ========================================================================
   * 6. Get Profile (Token Required)
   * ======================================================================== */
  {
    id: 'get-profile',
    title: 'Get User Profile',
    method: 'GET',
    endpoint: '/api/v1/users/profile',
    category: 'User Profile',
    summary: 'Retrieves the complete profile data of the currently authenticated user.',
    description:
      'Extracts the identity from the Bearer token in the Authorization header and returns the user record (uid, email, username, firstname, lastname, gender, age).',
    requiresAuth: true,
    defaultHeaders: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSJ9.sig_sample',
      Accept: 'application/json',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        user: {
          uid: 'usr_101a',
          email: 'alex.morgan@example.com',
          username: 'alexmorgan',
          firstname: 'Alex',
          lastname: 'Morgan',
          gender: 'Female',
          age: 28,
          createdAt: '2026-08-15T10:30:00Z',
        },
      },
    },
    learningNotes: {
      purpose: 'Understand how HTTP GET requests use Authorization headers to fetch context-specific user identity without passing UIDs in the URL.',
      qaTestCases: [
        'Positive: Execute with active login token to retrieve current user details.',
        'Negative: Execute with "Bearer invalid_token" to confirm 401 Unauthorized.',
        'Negative: Test header casing (e.g. lowercase "authorization") to verify standard header parsing.',
      ],
      commonErrors: [
        '401 Unauthorized — Missing Authorization header or malformed token format.',
      ],
    },
  },

  /* ========================================================================
   * 7. Update Profile (Token Required)
   * ======================================================================== */
  {
    id: 'update-profile',
    title: 'Update User Profile',
    method: 'PUT',
    endpoint: '/api/v1/users/profile',
    category: 'User Profile',
    summary: 'Updates profile fields (names, gender, age, username) for the authenticated user.',
    description:
      'Modifies user details in the session database. Checks username collisions and persists changes across subsequent GET Profile and List Users calls.',
    requiresAuth: true,
    defaultHeaders: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSJ9.sig_sample',
      Accept: 'application/json',
    },
    defaultBody: {
      firstname: 'Alexandra',
      lastname: 'Morgan-Cole',
      gender: 'Female',
      age: 29,
      username: 'alexm_updated',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'Profile updated successfully.',
        user: {
          uid: 'usr_101a',
          email: 'alex.morgan@example.com',
          username: 'alexm_updated',
          firstname: 'Alexandra',
          lastname: 'Morgan-Cole',
          gender: 'Female',
          age: 29,
          createdAt: '2026-08-15T10:30:00Z',
          updatedAt: '2026-09-04T12:10:00.000Z',
        },
      },
    },
    learningNotes: {
      purpose: 'Practice testing PUT/PATCH idempotent mutation endpoints and verifying data state reflection.',
      qaTestCases: [
        'Positive: Change firstname and age, then execute "Get Profile" to verify changes persisted.',
        'Negative (Username Taken): Attempt to update username to an existing user\'s username (e.g. "davidk") to assert 409 Conflict.',
        'Negative: Submit invalid age (-5 or 150) to check boundary validation.',
      ],
      commonErrors: [
        '401 Unauthorized — Missing Bearer token.',
        '409 Conflict — The updated username is already taken by another account.',
      ],
    },
  },

  /* ========================================================================
   * 8. List Users
   * ======================================================================== */
  {
    id: 'list-users',
    title: 'List Users',
    method: 'GET',
    endpoint: '/api/v1/users',
    category: 'User Administration',
    summary: 'Fetches the directory of all registered users with optional search filtering.',
    description:
      'Returns an array of user objects currently stored in the session database. Supports query string search filtering by name, username, or email.',
    requiresAuth: false,
    defaultHeaders: {
      Accept: 'application/json',
    },
    defaultParams: {
      search: '',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        count: 3,
        total: 3,
        filter: null,
        users: [
          {
            uid: 'usr_101a',
            email: 'alex.morgan@example.com',
            username: 'alexmorgan',
            firstname: 'Alex',
            lastname: 'Morgan',
            gender: 'Female',
            age: 28,
          },
          {
            uid: 'usr_102b',
            email: 'david.kim@example.com',
            username: 'davidk',
            firstname: 'David',
            lastname: 'Kim',
            gender: 'Male',
            age: 34,
          },
          {
            uid: 'usr_103c',
            email: 'sam.taylor@example.com',
            username: 'samt',
            firstname: 'Sam',
            lastname: 'Taylor',
            gender: 'Non-binary',
            age: 24,
          },
        ],
      },
    },
    learningNotes: {
      purpose: 'Test collection retrieval, schema consistency across array items, and query string parameters.',
      qaTestCases: [
        'Positive: Retrieve all users and verify that sensitive fields like passwordHash are excluded from the output.',
        'Filtering: Use query parameter ?search=david to verify filtered subset returns exactly matching records.',
        'End-to-End: Register a new user, call List Users, and confirm the new user is present in the list.',
      ],
      commonErrors: [
        'Data Leak: Verify passwords or password hashes are never exposed in public list responses.',
      ],
    },
  },

  /* ========================================================================
   * 9. Delete User (Token Required)
   * ======================================================================== */
  {
    id: 'delete-user',
    title: 'Delete User',
    method: 'DELETE',
    endpoint: '/api/v1/users/{uid}',
    category: 'User Administration',
    summary: 'Deletes a user account by UID from the persistent session database.',
    description:
      'Performs deletion of the user specified by the {uid} path parameter. Requires authorization token.',
    requiresAuth: true,
    defaultHeaders: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1c3JfMTAxYSJ9.sig_sample',
      Accept: 'application/json',
    },
    defaultParams: {
      uid: 'usr_103c',
    },
    sampleResponse: {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: {
        success: true,
        message: 'User deleted successfully.',
        deletedUid: 'usr_103c',
        deletedEmail: 'sam.taylor@example.com',
        remainingUsersCount: 2,
      },
    },
    learningNotes: {
      purpose: 'Practice testing destructive HTTP DELETE operations and path parameters.',
      qaTestCases: [
        'Positive: Delete a user by UID, then call "List Users" to verify they have been removed from the database.',
        'Negative (404): Try deleting a non-existent UID like "usr_99999" to verify 404 Not Found response.',
        'Negative (Unauthorized): Send request without Authorization header to assert 401 Unauthorized.',
      ],
      commonErrors: [
        '401 Unauthorized — Missing Authorization header.',
        '404 Not Found — User with specified UID does not exist in the database.',
      ],
    },
  },
];

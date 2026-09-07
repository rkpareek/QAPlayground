export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other' | 'Prefer not to say';
  age: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StoredUser extends UserProfile {
  passwordHash: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpointDef {
  id: string;
  title: string;
  method: HttpMethod;
  endpoint: string;
  category: 'Authentication' | 'Password Management' | 'User Profile' | 'User Administration';
  summary: string;
  description: string;
  requiresAuth: boolean;
  defaultHeaders: Record<string, string>;
  defaultBody?: any;
  defaultParams?: Record<string, string>;
  sampleResponse: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
  };
  learningNotes: {
    purpose: string;
    qaTestCases: string[];
    commonErrors: string[];
  };
}

export interface MockApiResponse {
  status: number;
  statusText: string;
  latencyMs: number;
  timestamp: string;
  headers: Record<string, string>;
  body: any;
  requestSent: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
  };
}

export interface ApiSessionState {
  users: StoredUser[];
  activeToken: string | null;
  activeUser: UserProfile | null;
  lastResetToken: string | null;
  lastResetEmail: string | null;
  lastResetCode: string | null;
}

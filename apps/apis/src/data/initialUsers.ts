import { StoredUser } from '../types';

export const INITIAL_USERS: StoredUser[] = [
  {
    uid: 'usr_101a',
    email: 'alex.morgan@example.com',
    username: 'alexmorgan',
    firstname: 'Alex',
    lastname: 'Morgan',
    gender: 'Female',
    age: 28,
    passwordHash: 'Password123!',
    createdAt: '2026-08-15T10:30:00Z',
  },
  {
    uid: 'usr_102b',
    email: 'david.kim@example.com',
    username: 'davidk',
    firstname: 'David',
    lastname: 'Kim',
    gender: 'Male',
    age: 34,
    passwordHash: 'Password123!',
    createdAt: '2026-08-20T14:15:00Z',
  },
  {
    uid: 'usr_103c',
    email: 'sam.taylor@example.com',
    username: 'samt',
    firstname: 'Sam',
    lastname: 'Taylor',
    gender: 'Non-binary',
    age: 24,
    passwordHash: 'Password123!',
    createdAt: '2026-09-01T09:45:00Z',
  },
];

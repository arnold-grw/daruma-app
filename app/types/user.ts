
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  languagePreference: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  accessToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  languagePreference?: LangPref;
  useDarkmode?: boolean;
}

export interface AuthSession {
  userId: string;
  email: string;
  accessToken: string;
}

export type LangPref = "en" | "de" | "jp" | "fr" | "es";
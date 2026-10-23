
export interface User {
  id: string;
  name: string;
  email?: string; // only set once accounts exist
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

export type LangPref = "en" | "de" | "fr" | "es" | "it" | "ja" | "zh";
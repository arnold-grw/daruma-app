
export interface User {
  id: string;
  name: string;
  email?: string; // only set once accounts exist
  createdAt: string;
  updatedAt: string;
  languagePreference?: LangPref;
  useDarkmode?: boolean;
  // darumas that got their second eye; unlocks colors (see COLOR_UNLOCKS)
  completedDarumaCount: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  accessToken: string;
}

export type LangPref = "en" | "de" | "fr" | "es" | "it" | "ja" | "zh";
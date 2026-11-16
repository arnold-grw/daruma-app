import { LangPref } from "@/types/user";

// languages to choose from (profile and intro); chinese not included until font is upgraded
export const LANGUAGES: LangPref[] = ["en", "ja", "de", "fr", "es", "it"];

// every language with a translation file (i18n/locales)
export const SUPPORTED_LANGUAGES: LangPref[] = ["en", "de", "fr", "es", "it", "ja", "zh"];

// name of each language in that language (intro language page)
export const LANGUAGE_NAMES: Record<LangPref, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  ja: "日本語",
  zh: "中文",
};

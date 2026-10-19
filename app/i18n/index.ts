// i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Statische Imports, damit Metro sie zur Build-Zeit erkennen und bundlen kann
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json"; // Latin American Spanish
import ja from "./locales/ja.json";
import zh from "./locales/zh.json"; // Simplified Chinese (Mandarin)

const LOCALES: Record<string, any> = { en, de, fr, es, ja, zh };

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: undefined,
  interpolation: { escapeValue: false },
  resources: {},
});

export async function setLanguage(lang: string) {
  const data = LOCALES[lang] ?? LOCALES["en"];
  const resolvedLang = LOCALES[lang] ? lang : "en";

  if (!i18n.hasResourceBundle(resolvedLang, "translation")) {
    i18n.addResourceBundle(resolvedLang, "translation", data, true, true);
  }

  await i18n.changeLanguage(resolvedLang);
}

export async function initLanguage() {
  const locales = Localization.getLocales();
  const device = locales[0]?.languageCode ?? "en";
  await setLanguage(device);
}

export default i18n;
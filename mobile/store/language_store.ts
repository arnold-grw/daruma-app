//store/language_store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { create } from "zustand";
import { LangPref } from "../types/user";
import i18n, { setLanguage as i18nSetLanguage } from "@/i18n";
import { useUserStore } from "@/store/user_store";

const STORAGE_KEY = "daruma-language";

interface LanguageState {
	language: LangPref;
	initialize: () => Promise<void>;
	setLanguage: (lang: LangPref, persistToUser?: boolean) => Promise<void>;
}

// "jp" was used for Japanese before, the ISO 639-1 code is "ja"
const normalizeLang = (lang: string): LangPref => (lang === "jp" ? "ja" : lang) as LangPref;

const readStoredLang = async (): Promise<LangPref | null> => {
	try {
		const stored = await AsyncStorage.getItem(STORAGE_KEY);
		if (!stored) return null;
		return normalizeLang(stored);
	} catch {
		return null;
	}
};

const persistLang = async (lang: LangPref) => {
	try {
		await AsyncStorage.setItem(STORAGE_KEY, lang);
	} catch {
		// ignore
	}
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
	language: "en",

	initialize: async () => {
		const { activeUser } = useUserStore.getState();

		// 1) use user's preference if present
		const fromUser = activeUser?.languagePreference ? normalizeLang(activeUser.languagePreference) : undefined;
		if (fromUser) {
			await i18nSetLanguage(fromUser);
			set({ language: fromUser });
			return;
		}

		// 2) use app stored language (app settings)
		const stored = await readStoredLang();
		if (stored) {
			await i18nSetLanguage(stored);
			set({ language: stored });
			return;
		}

		// 3) use device locale (first part)
		const locales = Localization.getLocales();
    const device = (locales[0]?.languageCode || "en") as LangPref;
    const fallback: LangPref = device || "en";
		await i18nSetLanguage(fallback);
		set({ language: fallback });
	},

	setLanguage: async (lang, persistToUser = true) => {
		await i18nSetLanguage(lang);
		set({ language: lang });
		void persistLang(lang);

		if (persistToUser) {
			// update the active user's preference if editable
			const { activeUserId, updateCurrentUser } = useUserStore.getState() as any;
			if (activeUserId && typeof updateCurrentUser === "function") {
				try {
					await updateCurrentUser({ languagePreference: lang });
				} catch {
					// ignore update errors
				}
			}
		}
	},
}));

// initialize immediately
void useLanguageStore.getState().initialize();
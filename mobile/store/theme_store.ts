import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type ThemeScheme = "light" | "dark";

const STORAGE_KEY = "daruma-theme-scheme";

interface ThemeState {
  scheme: ThemeScheme;
  darkmode: boolean;
  initialize: () => Promise<void>;
  setScheme: (scheme: ThemeScheme) => void;
  toggleScheme: () => void;
}

const readStoredScheme = async (): Promise<ThemeScheme> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const persistScheme = async (scheme: ThemeScheme) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // Ignore persistence errors and keep the in-memory state.
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  scheme: "light",
  darkmode: false,

  initialize: async () => {
    const storedScheme = await readStoredScheme();
    set({ scheme: storedScheme, darkmode: storedScheme === "dark" });
  },

  setScheme: (scheme) => {
    set({ scheme, darkmode: scheme === "dark" });
    void persistScheme(scheme);
  },

  toggleScheme: () => {
    set((state) => {
      const nextScheme: ThemeScheme = state.scheme === "dark" ? "light" : "dark";
      void persistScheme(nextScheme);
      return { scheme: nextScheme, darkmode: nextScheme === "dark" };
    });
  },
}));

void useThemeStore.getState().initialize();

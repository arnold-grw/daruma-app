import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

// set once the intro was finished or skipped; without it the app opens with the intro
const STORAGE_KEY = "daruma-intro-seen";

interface IntroState {
  // false until the flag was read from storage (app/_layout.tsx waits for it before hiding the splash)
  loaded: boolean;
  seen: boolean;
  load: () => Promise<void>;
  markSeen: () => Promise<void>;
  // after an app reset: the intro shows again
  reset: () => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  loaded: false,
  seen: false,

  load: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      set({ seen: stored === "true", loaded: true });
    } catch {
      // storage not readable: better skip the intro than show it on every start
      set({ seen: true, loaded: true });
    }
  },

  markSeen: async () => {
    set({ seen: true });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore, the intro just shows again on the next start
    }
  },

  reset: () => set({ seen: false }),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDarumaStore } from "@/store/daruma_store";
import { useIntroStore } from "@/store/intro_store";
import { useLanguageStore } from "@/store/language_store";
import { useThemeStore } from "@/store/theme_store";
import { useUserStore } from "@/store/user_store";

/**
 * Deletes all data of the app (darumas, user, settings, intro flag) and sets every store back
 * to the state of a first launch. Afterwards the intro shows again (app/(tabs)/_layout.tsx redirects to it).
 */
export async function resetApp() {
  await AsyncStorage.clear();

  // the same order as on a first launch: user first (language reads its preference), then the rest
  await useUserStore.getState().load();
  await useDarumaStore.getState().load();
  useDarumaStore.getState().resetDraft();
  await useLanguageStore.getState().initialize();
  await useThemeStore.getState().initialize();
  useIntroStore.getState().reset();
}

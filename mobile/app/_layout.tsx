import { ThemeTransitionProvider } from '@/components/theme_transition';
import { FONT } from '@/components/typography';
import { useUserStore } from '@/store/user_store';
import { MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c/700Bold';
import { useFonts } from 'expo-font';
import useAppTheme from '@/constants/theme';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { NAVIGATION } from '@/constants/navigation';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // only the Bold file is imported, so the other weights of the package are not bundled
    // (Quicksand is still in assets/fonts/quicksand: require its Bold file here and set FONT to switch back)
    [FONT]: MPLUSRounded1c_700Bold,
  });
  const [usersLoaded, setUsersLoaded] = useState(false);
  const { colors, darkmode } = useAppTheme();
  // The navigators draw their own background behind the screens (light gray by default).
  // It shows through during screen and tab animations, so it gets the app colors.
  const baseTheme = darkmode ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // Load the local user once at startup, so every screen (and new darumas) can rely on an active user
  useEffect(() => {
    useUserStore.getState().load()
      .catch((error) => console.error('Failed to load users:', error))
      .finally(() => setUsersLoaded(true));
  }, []);

  const isReady = (fontsLoaded || !!fontError) && usersLoaded;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          {/* cross-fades the whole screen when dark/light mode changes */}
          <ThemeTransitionProvider>
            <ThemeProvider value={navigationTheme}>
              {/* iOS swipe back: see constants/navigation.ts */}
              <Stack screenOptions={{ headerShown: false, gestureEnabled: NAVIGATION.swipeBack }} />
            </ThemeProvider>
          </ThemeTransitionProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

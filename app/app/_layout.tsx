import { FONT } from '@/components/typography';
import { useUserStore } from '@/store/user_store';
import { MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
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
          <Stack screenOptions={{ headerShown: false }} />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

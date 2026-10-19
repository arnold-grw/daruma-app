import { useUserStore } from '@/store/user_store';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'MyFont': require('../assets/fonts/quicksand/static/Quicksand-Bold.ttf'),
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
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

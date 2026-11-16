import { NAVIGATION } from "@/constants/navigation";
import { Href, router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";

export const safeBack = (fallback: Href = "/") => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
};

/**
 * Switches the iOS swipe back on or off while this screen is shown.
 * Also sets it on the parent stack: the first screen of the daruma folder is swiped away by the root stack.
 * When the screen is left, the parent gets the normal setting (NAVIGATION.swipeBack) again.
 */
export function useSwipeBack(enabled: boolean) {
  const navigation = useNavigation();
  useFocusEffect(useCallback(() => {
    const parent = navigation.getParent();
    navigation.setOptions({ gestureEnabled: enabled });
    parent?.setOptions({ gestureEnabled: enabled });
    return () => parent?.setOptions({ gestureEnabled: NAVIGATION.swipeBack });
  }, [navigation, enabled]));
}

/**
 * Android system back (gesture or button) while this screen is shown: onBack is called first.
 * It returns true when it handled the back itself (e.g. one step back in a flow),
 * false to leave the screen as usual. Only active with NAVIGATION.systemBackStepsBack.
 */
export function useSystemBack(onBack: () => boolean) {
  useFocusEffect(useCallback(() => {
    if (!NAVIGATION.systemBackStepsBack) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => subscription.remove();
  }, [onBack]));
}

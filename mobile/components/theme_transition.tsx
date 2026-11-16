import { ANIMATION_DURATION, timing } from "@/constants/animations";
import { ThemeScheme, useThemeStore } from "@/store/theme_store";
import { ComponentRef, createContext, ReactNode, useContext, useRef, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { scheduleOnRN } from "react-native-worklets";

const SwitchSchemeContext = createContext<(scheme: ThemeScheme) => void>(() => {});

/** Switches dark/light mode with a cross-fade (falls back to a hard switch without the provider). */
export function useSwitchScheme() {
  return useContext(SwitchSchemeContext);
}

/**
 * Cross-fade between dark and light mode:
 * 1. take a picture of the screen in the old colors and lay it over everything,
 * 2. switch the colors underneath (hidden by the picture),
 * 3. fade the picture out, so the old colors blend into the new ones.
 */
export function ThemeTransitionProvider({ children }: { children: ReactNode }) {
  const setScheme = useThemeStore((state) => state.setScheme);
  const screenRef = useRef<ComponentRef<typeof View>>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  // true while a switch runs (further taps are ignored)
  const busy = useRef(false);
  // the scheme that is switched to as soon as the picture covers the screen
  const pendingScheme = useRef<ThemeScheme | null>(null);
  const opacity = useSharedValue(0);

  const switchScheme = async (scheme: ThemeScheme) => {
    if (busy.current) return;
    busy.current = true;
    pendingScheme.current = scheme;
    try {
      const uri = await captureRef(screenRef, {
        format: "jpg",
        quality: 0.9,
        // web has no files, it gets the picture as a data uri
        result: Platform.OS === "web" ? "data-uri" : "tmpfile",
      });
      opacity.set(1);
      setSnapshot(uri); // continues in handleSnapshotShown
    } catch (error) {
      // no picture possible: switch without animation
      console.warn("Theme transition: screen capture failed", error);
      pendingScheme.current = null;
      busy.current = false;
      setScheme(scheme);
    }
  };

  const finish = () => {
    if (snapshot) releaseCapture(snapshot);
    busy.current = false;
    setSnapshot(null);
  };

  const handleSnapshotShown = () => {
    const scheme = pendingScheme.current;
    // onLoad can fire more than once (e.g. on web after a re-render), only the first one switches
    if (!scheme) return;
    pendingScheme.current = null;
    // wait one frame, so the picture is really drawn before the colors change underneath
    requestAnimationFrame(() => {
      setScheme(scheme);
      opacity.set(withTiming(0, timing(ANIMATION_DURATION.themeFade), () => scheduleOnRN(finish)));
    });
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <SwitchSchemeContext.Provider value={switchScheme}>
      {/* collapsable={false}: Android must keep this view, otherwise there is nothing to capture */}
      <View ref={screenRef} collapsable={false} style={{ flex: 1 }}>
        {children}
      </View>
      {snapshot && (
        <Animated.View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }, overlayStyle]}>
          <Image source={{ uri: snapshot }} style={StyleSheet.absoluteFill} onLoad={handleSnapshotShown} />
        </Animated.View>
      )}
    </SwitchSchemeContext.Provider>
  );
}

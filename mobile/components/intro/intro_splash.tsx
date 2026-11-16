// Title screen before the first intro page (app/intro.tsx): the 3D daruma rises from below while turning,
// "Daruma" and its Japanese name glide in above it, then a start button appears. No progress bar, no action bar.
import Daruma3D, { VIEW_HEIGHT_RATIO } from "@/components/3d/daruma_model";
import { Text } from "@/components/typography";
import { ANIMATION_DURATION, timing } from "@/constants/animations";
import useTheme from "@/constants/theme";
import { DarumaColor } from "@/types/daruma";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// color of the daruma on the title screen
const SPLASH_COLOR: DarumaColor = "red";
// height of the daruma (px); on small screens at most this share of the screen height
const DARUMA_SIZE = 300;
const DARUMA_MAX_HEIGHT_RATIO = 0.4;
// the two title lines; the name is not translated
const TITLE = "Daruma";
const TITLE_JAPANESE = "だるま";
const TITLE_FONT_SIZE = 52;
const TITLE_JAPANESE_FONT_SIZE = 26;
// how far (px) the title lines glide in sideways: "Daruma" from the left, the Japanese name from the right
const TITLE_SLIDE_DISTANCE = 80;
// delays (ms) after the model has loaded: title, Japanese name, start button
const TITLE_DELAY = 700;
const TITLE_JAPANESE_DELAY = 950;
const BUTTON_DELAY = 1700;
// how far (px) the button moves up while it fades in
const BUTTON_RISE = 20;
// if the model takes longer than this (ms) to load, title and button start anyway
const READY_TIMEOUT = 3000;

export default function IntroSplash({ onStart }: { onStart: () => void }) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const size = Math.min(DARUMA_SIZE, height * DARUMA_MAX_HEIGHT_RATIO);

  // 0 -> 1 for each part of the animation
  const entrance = useSharedValue(0);
  const title = useSharedValue(0);
  const titleJapanese = useSharedValue(0);
  const button = useSharedValue(0);
  // true once the model has loaded (or the timeout ran out): the animation starts and the button can be pressed
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), READY_TIMEOUT);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    entrance.set(withTiming(1, timing(ANIMATION_DURATION.splashRise)));
    title.set(withDelay(TITLE_DELAY, withTiming(1, timing(ANIMATION_DURATION.splashTitle))));
    titleJapanese.set(withDelay(TITLE_JAPANESE_DELAY, withTiming(1, timing(ANIMATION_DURATION.splashTitle))));
    button.set(withDelay(BUTTON_DELAY, withTiming(1, timing(ANIMATION_DURATION.splashButton))));
  }, [ready, entrance, title, titleJapanese, button]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: title.get(),
    transform: [{ translateX: -(1 - title.get()) * TITLE_SLIDE_DISTANCE }],
  }));
  const titleJapaneseStyle = useAnimatedStyle(() => ({
    opacity: titleJapanese.get(),
    transform: [{ translateX: (1 - titleJapanese.get()) * TITLE_SLIDE_DISTANCE }],
  }));
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: button.get(),
    transform: [{ translateY: (1 - button.get()) * BUTTON_RISE }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* the 3D view fills the whole screen, so the daruma rises from the bottom edge of the screen;
          the camera keeps it in the middle, the layout below leaves the same space for it */}
      <Daruma3D
        color={SPLASH_COLOR}
        size={size}
        entrance={entrance}
        onReady={() => setReady(true)}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {/* top and bottom take the same height, so the gap in between is exactly where the daruma stands;
          touches outside the button go through to the daruma (turning and wobbling) */}
      <View style={{ flex: 1, pointerEvents: "box-none" }}>
        <View style={{ flex: 1, paddingTop: insets.top, justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
          <Animated.View style={titleStyle}>
            <Text style={{ color: colors.text, fontSize: TITLE_FONT_SIZE, textAlign: "center" }}>{TITLE}</Text>
          </Animated.View>
          <Animated.View style={titleJapaneseStyle}>
            <Text style={{ color: colors.primary, fontSize: TITLE_JAPANESE_FONT_SIZE, textAlign: "center" }}>{TITLE_JAPANESE}</Text>
          </Animated.View>
        </View>

        <View style={{ height: size * VIEW_HEIGHT_RATIO, pointerEvents: "none" }} />

        <View style={{ flex: 1, paddingBottom: insets.bottom, justifyContent: "center", alignItems: "center", pointerEvents: "box-none" }}>
          <Animated.View style={buttonStyle}>
            <Pressable
              onPress={onStart}
              disabled={!ready}
              accessibilityRole="button"
              style={{ paddingHorizontal: 40, height: 50, borderRadius: 8, backgroundColor: colors.primary, justifyContent: "center" }}
            >
              <Text style={{ color: colors.background, fontSize: 18 }}>{t("intro.start")}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

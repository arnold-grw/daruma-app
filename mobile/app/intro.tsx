// app/intro.tsx
// Shown on the first launch (app/(tabs)/_layout.tsx redirects here), again from the profile ("Watch intro again")
// and after an app reset. Every page can be skipped with the ✕; skipping or finishing leads to home.
import BottomActionBar from "@/components/action_bar";
import { FirstDarumaPage, FirstEyePage, LanguagePage, SecondEyePage, TraditionPage, WelcomePage } from "@/components/intro/intro_pages";
import { ProgressIndicator } from "@/components/new_daruma/progress_indicator";
import { ANIMATION_DURATION } from "@/constants/animations";
import useTheme from "@/constants/theme";
import { useIntroStore } from "@/store/intro_store";
import { useSystemBack } from "@/utils/navigation";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, LayoutAnimationConfig } from "react-native-reanimated";

// ── Pages of the intro, in this order — reorder or add freely ──
const PAGES = ["welcome", "language", "tradition", "first_eye", "second_eye", "first_daruma"] as const;
// ───────────────────────────────────────────────────────────────

// the same page change as in the new daruma flow
const PAGE_ANIMATIONS = {
  forward: {
    entering: FadeInRight.duration(ANIMATION_DURATION.stepChange),
    exiting: FadeOutLeft.duration(ANIMATION_DURATION.stepChange),
  },
  back: {
    entering: FadeInLeft.duration(ANIMATION_DURATION.stepChange),
    exiting: FadeOutRight.duration(ANIMATION_DURATION.stepChange),
  },
};

export default function Intro() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const markSeen = useIntroStore((s) => s.markSeen);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [isNavigating, setIsNavigating] = useState(false);

  const page = PAGES[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === PAGES.length - 1;

  // blocks double taps while a page changes
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => setIsNavigating(false), ANIMATION_DURATION.stepChange);
    return () => clearTimeout(timer);
  }, [isNavigating]);

  // the old page plays the exit animation of its last render, so the direction is set one frame earlier
  const changePage = (newDirection: "forward" | "back") => {
    if (isNavigating) return;
    setIsNavigating(true);
    setDirection(newDirection);
    requestAnimationFrame(() => setPageIndex((i) => i + (newDirection === "forward" ? 1 : -1)));
  };

  // skip, "later" or done: home (the intro replaces itself, so there is no way back into it)
  const finish = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    void markSeen();
    router.replace("/");
  };

  // last page: straight into the new daruma flow; cancelling it there leads to home,
  // saving it leads to home with the new card sliding in (both handled by app/daruma/new.tsx)
  const createFirstDaruma = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    void markSeen();
    router.replace({ pathname: "/daruma/new", params: { fromIntro: "1" } });
  };

  // Android system back: one page back; on the first page the app closes as usual
  useSystemBack(() => {
    if (isFirst) return false;
    changePage("back");
    return true;
  });

  const renderPage = () => {
    switch (page) {
      case "welcome": return <WelcomePage />;
      case "language": return <LanguagePage />;
      case "tradition": return <TraditionPage />;
      case "first_eye": return <FirstEyePage />;
      case "second_eye": return <SecondEyePage />;
      case "first_daruma": return <FirstDarumaPage onLater={finish} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ✕ skips the whole intro */}
      <ProgressIndicator stepIndex={pageIndex} totalSteps={PAGES.length} onClose={finish} />

      <LayoutAnimationConfig skipEntering>
        <Animated.View
          key={page}
          style={{ flex: 1 }}
          entering={PAGE_ANIMATIONS[direction].entering}
          exiting={PAGE_ANIMATIONS[direction].exiting}
        >
          {renderPage()}
        </Animated.View>
      </LayoutAnimationConfig>

      <BottomActionBar
        onConfirm={isLast ? createFirstDaruma : () => changePage("forward")}
        onCancel={isFirst ? finish : () => changePage("back")}
        confirmLabel={isLast ? t("intro.first_daruma.create") : t("common.next")}
        cancelLabel={isFirst ? t("intro.skip") : t("common.back")}
        canClick={!isNavigating}
      />
    </View>
  );
}

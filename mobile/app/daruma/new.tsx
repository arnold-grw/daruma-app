
// app/daruma/new.tsx
import BottomActionBar from "@/components/action_bar";
import KeyboardShift from "@/components/keyboard_shift";
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { NAVIGATION } from "@/constants/navigation";
import { safeBack, useSwipeBack, useSystemBack } from "@/utils/navigation";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, LayoutAnimationConfig } from "react-native-reanimated";
import { ANIMATION_DURATION } from "@/constants/animations";

// Import your step components
import { ProgressIndicator } from "@/components/new_daruma/progress_indicator";
import { StepColor } from "@/components/new_daruma/step_color";
import { StepConfirm } from "@/components/new_daruma/step_confirm";
import { StepDeadline } from "@/components/new_daruma/step_deadline";
import { StepGoal } from "@/components/new_daruma/step_goal";
import { StepPaint } from "@/components/new_daruma/step_paint";

// ── Define steps here — reorder or add freely ──────────────────
const STEPS = [
  { key: 'color', component: StepColor, canSkip: true  },
  { key: 'goal',  component: StepGoal,  canSkip: false },
  { key: 'deadline', component: StepDeadline, canSkip: true },
  { key: 'paint', component: StepPaint, canSkip: false },
  { key: 'confirm', component: StepConfirm, canSkip: false }
];
// ───────────────────────────────────────────────────────────────

// Step change: the old step fades out while moving a bit to one side, the new one fades in from the other side.
// Forward: content moves to the left, back: to the right.
const STEP_ANIMATIONS = {
  forward: {
    entering: FadeInRight.duration(ANIMATION_DURATION.stepChange),
    exiting: FadeOutLeft.duration(ANIMATION_DURATION.stepChange),
  },
  back: {
    entering: FadeInLeft.duration(ANIMATION_DURATION.stepChange),
    exiting: FadeOutRight.duration(ANIMATION_DURATION.stepChange),
  },
};

export default function NewDaruma() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { draft, setDraft, commitDraft, resetDraft } = useDarumaStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const currentStep = STEPS[stepIndex];
  const StepComponent = currentStep.component;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  useEffect(() => {
    setDraft({ color: 'red', goal: '', notes: '' });
    return () => resetDraft();
  }, []);

  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, isNavigating]);

  // The old step plays the exit animation it had in its last render, so the direction
  // is set first and the step changes one frame later, when the old step already knows it.
  const changeStep = (newDirection: 'forward' | 'back') => {
    setDirection(newDirection);
    requestAnimationFrame(() => setStepIndex(i => i + (newDirection === 'forward' ? 1 : -1)));
  };

  const handleNext = async () => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (isLast) {
      const newDarumaId = await commitDraft();
      // home slides the new card in when it gets the id
      router.replace({ pathname: '/', params: { newDarumaId } });
    } else {
      changeStep('forward');
    }
  };

  const handleBack = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (isFirst) {
      resetDraft();
      safeBack();
    } else {
      changeStep('back');
    }
  };

  // ✕ at the top: leaves the whole flow from any step
  const handleCancel = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    resetDraft();
    safeBack();
  };

  const [canProceed, setCanProceed] = useState(false);

  // no swipe back while painting (iOS); the Android system back goes one step back like the back button
  useSwipeBack(NAVIGATION.swipeBackWhilePainting);
  useSystemBack(() => {
    handleBack();
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Everything except the action bar moves up with the keyboard */}
      <KeyboardShift style={{ flex: 1 }}>
        <ProgressIndicator stepIndex={stepIndex} totalSteps={STEPS.length} onClose={NAVIGATION.cancelButtonTop ? handleCancel : undefined} />

        {/* skipEntering: the first step comes in with the screen, without its own animation */}
        <LayoutAnimationConfig skipEntering>
          {/* the key makes every step a new view, so the old one can animate out while the new one animates in */}
          <Animated.View
            key={currentStep.key}
            style={{ flex: 1 }}
            entering={STEP_ANIMATIONS[direction].entering}
            exiting={STEP_ANIMATIONS[direction].exiting}
          >
            <StepComponent
              draft={draft}
              setDraft={setDraft}
              onValidChange={setCanProceed}
            />
          </Animated.View>
        </LayoutAnimationConfig>
      </KeyboardShift>

      <BottomActionBar
        onConfirm={handleNext}
        onCancel={handleBack}
        canConfirm={(canProceed || currentStep.canSkip)}
        confirmLabel={isLast ? t("common.confirm") : t("common.next")}
        cancelLabel={isFirst ? t("common.cancel") : t("common.back")}
        canClick={!isNavigating}
      />
    </View>
  );
}
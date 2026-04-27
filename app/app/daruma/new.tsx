// app/daruma/new.tsx
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text } from '@/components/typography';
import { router } from "expo-router";
import useTheme from "@/constants/theme";
import { DarumaDraft, useDarumaStore } from "@/store/daruma_store";
import BottomActionBar from "@/components/bottom_action_bar";
import { safeBack } from "@/utils/navigation"

// Import your step components
import { StepColor } from "@/components/new_daruma/step_color";
import { StepGoal } from "@/components/new_daruma/step_goal";
//import { StepDeadline } from "@/components/new_daruma/step_deadline";
import { StepPaint } from "@/components/new_daruma/step_paint";
import { Daruma } from "@/types/daruma";
//import { StepConfirm } from "@/components/new_daruma/step_confirm";


// ── Define steps here — reorder or add freely ──────────────────
const STEPS = [
  { key: 'color', component: StepColor, canSkip: true  },
  { key: 'goal',  component: StepGoal,  canSkip: false },
  //{ key: 'deadline', component: StepDeadline, canSkip: true },
  { key: 'paint', component: StepPaint, canSkip: false },
  //{ key: 'confirm', component: StepConfirm, canSkip: false }
];
// ───────────────────────────────────────────────────────────────

export interface StepProps {
  draft: DarumaDraft;
  setDraft: (values: Partial<DarumaDraft>) => void;
  onValidChange: (valid: boolean) => void;
}

export default function NewDaruma() {
  const { colors } = useTheme();
  const { draft, setDraft, commitDraft, resetDraft } = useDarumaStore();
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];
  const StepComponent = currentStep.component;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  useEffect(() => {
    setDraft({ color: 'red', goal: '', notes: '' });
    return () => resetDraft(); // clean up on unmount
  }, []);

  const handleNext = async () => {
    if (isLast) {
      await commitDraft();
      router.replace('/');
    } else {
      setStepIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    if (isFirst) {
      resetDraft();
      safeBack();
    } else {
      setStepIndex(i => i - 1);
    }
  };

  // Each step tells new.tsx whether it's valid via this callback
  const [canProceed, setCanProceed] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* Progress indicator — just swap this out for a bar later */}
      <Text style={{ textAlign: 'center', marginTop: 50, color: colors.textSecondary }}>
        {stepIndex + 1} / {STEPS.length}
      </Text>

      {/* Active step — re-mounts on step change */}
      <StepComponent
        key={currentStep.key}
        draft={draft}
        setDraft={setDraft}
        onValidChange={setCanProceed}
      />

      <BottomActionBar
        onConfirm={handleNext}
        onCancel={handleBack}
        canConfirm={canProceed || currentStep.canSkip}
        confirmLabel={isLast ? "Confirm" : "Next"}
        cancelLabel={isFirst ? "Cancel" : "Back"}
      />
    </View>
  );
}
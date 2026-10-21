import { ANIMATION_DURATION, EASE_IN, timing } from "@/constants/animations";
import { useEffect, useState } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/**
 * Open/close animation for a modal.
 * `progress` runs from 0 (closed) to 1 (open) and drives the overlay and the content.
 * `mounted` keeps the Modal on screen until the closing animation is done
 * (a Modal with visible={false} disappears at once, so it could not animate out).
 */
export function useModalTransition(visible: boolean) {
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);
  // mount right away when opened (adjusting state during render avoids an extra frame)
  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (visible) {
      progress.set(withTiming(1, timing(ANIMATION_DURATION.modalIn)));
    } else {
      progress.set(
        withTiming(0, timing(ANIMATION_DURATION.modalOut, EASE_IN), (finished) => {
          if (finished) scheduleOnRN(setMounted, false);
        })
      );
    }
  }, [visible, progress]);

  return { mounted, progress };
}

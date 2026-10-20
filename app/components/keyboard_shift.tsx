import { ReactNode } from "react";
import { ViewProps } from "react-native";
import { KeyboardController, useKeyboardHandler, useReanimatedFocusedInput, useWindowDimensions } from "react-native-keyboard-controller";
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Space between the focused text field and the top of the keyboard
export const KEYBOARD_GAP = 24;

interface KeyboardShiftProps extends ViewProps {
  children: ReactNode;
  // Turn off while another KeyboardShift (e.g. in a modal) should react instead
  enabled?: boolean;
  gap?: number;
}

/**
 * Moves its whole content up while the keyboard is open, just far enough that the focused
 * TextInput ends `gap` above the keyboard (not at all if there is enough room).
 * Follows the keyboard animation frame by frame. Keep fixed bars (e.g. the action bar) outside of it.
 * A tap on an empty spot of the content closes the keyboard.
 */
interface FocusedLayout {
  absoluteY: number;
  height: number;
}

// Shift that keeps the focused field `gap` above the open keyboard.
// Shared values are accessed with get()/set() in this file: the React Compiler turns every
// `.value` read inside a closure into a memo key, i.e. a read during render (Reanimated warns).
function computeTarget(layout: FocusedLayout | undefined, currentShift: number, openKeyboardHeight: number, enabled: boolean, gap: number, windowHeight: number) {
  "worklet";
  if (!enabled || !layout || openKeyboardHeight <= 0) return 0;
  // the measured position already contains the current shift, so add it back
  const inputBottom = layout.absoluteY + layout.height + currentShift;
  const keyboardTop = windowHeight - openKeyboardHeight;
  return Math.max(0, inputBottom + gap - keyboardTop);
}

export default function KeyboardShift({ children, style, enabled = true, gap = KEYBOARD_GAP, ...rest }: KeyboardShiftProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { input } = useReanimatedFocusedInput();
  const keyboardHeight = useSharedValue(0); // height of the open keyboard (0 = closed)
  const target = useSharedValue(0); // shift while the keyboard is fully open
  const shift = useSharedValue(0); // current shift

  useKeyboardHandler(
    {
      onStart: (e) => {
        "worklet";
        if (e.height > 0) {
          keyboardHeight.set(e.height);
          target.set(computeTarget(input.get()?.layout, shift.get(), e.height, enabled, gap, windowHeight));
        }
      },
      onMove: (e) => {
        "worklet";
        shift.set(target.get() * e.progress);
      },
      onInteractive: (e) => {
        "worklet";
        shift.set(target.get() * e.progress);
      },
      onEnd: (e) => {
        "worklet";
        shift.set(target.get() * e.progress);
        if (e.height === 0) keyboardHeight.set(0);
      },
    },
    [enabled, gap, windowHeight]
  );

  // Focus moved to another text field while the keyboard stays open
  useAnimatedReaction(
    () => input.get()?.target,
    (current, previous) => {
      if (current == null || current === previous || keyboardHeight.get() === 0) return;
      target.set(computeTarget(input.get()?.layout, shift.get(), keyboardHeight.get(), enabled, gap, windowHeight));
      shift.set(withTiming(target.get(), { duration: 250 }));
    },
    [enabled, gap, windowHeight]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -shift.get() }],
  }));

  return (
    <Animated.View
      style={[style, animatedStyle]}
      // only taps that no child (text field, button, ...) handles end up here
      onStartShouldSetResponder={() => KeyboardController.isVisible()}
      onResponderRelease={() => KeyboardController.dismiss()}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}

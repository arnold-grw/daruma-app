import { Text } from "@/components/typography";
import { ANIMATION_DURATION, EASE_IN, timing } from "@/constants/animations";
import { useEffect, useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// how far (px) the old content moves up while it fades out, and the new content comes up from below
const SHIFT = 6;

/**
 * Animated swap of displayed content when `value` changes:
 * the old content fades out upwards, then the new content fades in from below.
 * Render the content from the returned `shown` (it lags behind `value` while the old content fades out)
 * and put `style` on an Animated.View around it.
 * `delay` (ms) lets several swaps start one after another.
 */
export function useSwapTransition<T>(value: T, delay = 0) {
  // the value that is on screen right now
  const [shown, setShown] = useState(value);
  // 0 = visible, -1 = faded out upwards, 1 = waiting below
  const position = useSharedValue(0);

  // new value: fade the old content out, then swap
  useEffect(() => {
    if (value === shown) {
      // the value came back before the old content was gone (e.g. swiped back): just show it again
      if (position.get() !== 0) position.set(withTiming(0, timing(ANIMATION_DURATION.textSwapIn)));
      return;
    }
    position.set(withDelay(
      delay,
      withTiming(-1, timing(ANIMATION_DURATION.textSwapOut, EASE_IN), (finished) => {
        if (finished) scheduleOnRN(setShown, value);
      })
    ));
  }, [value, shown, delay, position]);

  // swapped: bring the new content in from below
  useEffect(() => {
    if (position.get() === 0) return;
    position.set(1);
    position.set(withTiming(0, timing(ANIMATION_DURATION.textSwapIn)));
  }, [shown, position]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - Math.abs(position.get()),
    transform: [{ translateY: position.get() * SHIFT }],
  }));

  return { shown, style };
}

interface SwapTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  // position on the page: each line starts a bit later than the one above (index × textSwapStagger)
  index?: number;
}

/** Text that does not jump when its content changes (e.g. after a language switch), see useSwapTransition. */
export function SwapText({ children, style, index = 0 }: SwapTextProps) {
  const { shown, style: swapStyle } = useSwapTransition(children, index * ANIMATION_DURATION.textSwapStagger);

  return (
    <Animated.View style={swapStyle}>
      <Text style={style}>{shown}</Text>
    </Animated.View>
  );
}

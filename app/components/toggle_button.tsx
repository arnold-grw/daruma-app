import { Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ReactNode, useEffect } from "react";
import { Text } from "@/components/typography";
import { ANIMATION_DURATION, timing } from "@/constants/animations";

interface ToggleButtonProps {
  label: ReactNode;
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
  tabColor?: string;
}

const TRACK_WIDTH = 48;
const TRACK_PADDING = 3;
const THUMB_SIZE = 22;
// how far the thumb moves from off (left) to on (right)
const THUMB_TRAVEL = TRACK_WIDTH - 2 * TRACK_PADDING - THUMB_SIZE;

export default function ToggleButton({
  label,
  value,
  onValueChange,
  activeColor = "#b78358",
  inactiveColor = "#d9c7b1",
  textColor = "#201c18",
  tabColor = "#ffffff"
}: ToggleButtonProps) {
  // 0 = off, 1 = on; animates whenever value changes
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(value ? 1 : 0, timing(ANIMATION_DURATION.toggle)));
  }, [value, progress]);

  // the track blends between the two colors, the thumb slides to the side
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [inactiveColor, activeColor]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.container, {backgroundColor: tabColor}]}
      accessibilityRole="switch"
      accessibilityValue={{ text: value ? "on" : "off" }}
    >
      {/* a string gets the default style; anything else (e.g. a SwapText) is shown as it is */}
      <View style={{ flex: 1 }}>
        {typeof label === "string" ? <Text style={{ color: textColor, fontSize: 16 }}>{label}</Text> : label}
      </View>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14
  },
  track: {
    width: TRACK_WIDTH,
    height: 28,
    borderRadius: 999,
    padding: TRACK_PADDING,
    justifyContent: "center",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#fff",
  },
});

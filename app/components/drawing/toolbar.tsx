import { DrawingSettings } from "@/types/drawing";
import { Pressable, View, StyleSheet } from "react-native";
import { UndoIcon, BrushIcon } from "../icons/toolbar_icons";
import useTheme from "@/constants/theme";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Props {
  height: number;
  width: number;
  settings: DrawingSettings;
  onThicknessChange: (value: number) => void;
  onRemoveLastLine: () => void;
}

const MIN = 0.0;
const MAX = 0.5;
const ICON_AREA = 50; // space for brush icon at top
const BUTTON_AREA = 60; // space for undo button at bottom
const PADDING = 10;
const BUTTON_MARGIN = 10;

export function Toolbar({
  height = 200,
  width = 75,
  settings,
  onThicknessChange,
  onRemoveLastLine,
}: Props) {
  const { colors } = useTheme();

  const trackHeight = height - ICON_AREA - BUTTON_AREA - PADDING * 2 - BUTTON_MARGIN;
  const thumbSize = 22;

  // Convert value → thumb Y position (top = max, bottom = min)
  const valueToY = (v: number) =>
    ((MAX - v) / (MAX - MIN)) * (trackHeight - thumbSize);

  const thumbY = useSharedValue(valueToY(settings.thickness));
  const startY = useSharedValue(0);

  const clamp = (val: number, lo: number, hi: number) =>
    Math.min(Math.max(val, lo), hi);

  const yToValue = (y: number): number => {
    const ratio = 1 - y / (trackHeight - thumbSize);
    return Math.round((MIN + ratio * (MAX - MIN)) / 0.05) * 0.05;
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startY.value = thumbY.value;
    })
    .onUpdate((e) => {
      thumbY.value = clamp(startY.value + e.translationY, 0, trackHeight - thumbSize);
      runOnJS(onThicknessChange)(yToValue(thumbY.value));
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: thumbY.value }],
  }));

  return (
    <View style={{
      height,
      width,
      backgroundColor: colors.card,
      borderRadius: 10,
      alignItems: "center",
      paddingVertical: PADDING,
      justifyContent: "space-between",
    }}>
      {/* Brush icon */}
      <View style={{ height: ICON_AREA, justifyContent: "center" }}>
        <BrushIcon color={colors.textSecondary} />
      </View>

      {/* Vertical slider track */}
      <GestureDetector gesture={pan}>
        <View style={{
            height: trackHeight,
            width: 44, // ← large enough touch target
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: BUTTON_MARGIN
        }}>
            {/* Visual track inside, gesture captured by outer View */}
            <View style={{
            height: trackHeight,
            width: 6,
            backgroundColor: colors.textSecondary,
            borderRadius: 3,
            //opacity: 0.4,
            }}>
            <Animated.View style={[{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: 3,
                backgroundColor: colors.primary,
            }, useAnimatedStyle(() => ({
                height: trackHeight - thumbSize - thumbY.value,
            }))]} />

            <Animated.View style={[{
                position: "absolute",
                left: -(thumbSize / 2 - 3),
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: colors.primary,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            }, thumbStyle]} />
            </View>
        </View>
        </GestureDetector>

      {/* Undo button */}
      <Pressable
        style={{
          height: BUTTON_AREA - 10,
          justifyContent: "center",
          padding: 10,
          backgroundColor: colors.primary,
          borderRadius: 10,
        }}
        onPress={onRemoveLastLine}
      >
        <UndoIcon color={colors.card} />
      </Pressable>
    </View>
  );
}
import { ReactNode, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ANIMATION_DURATION, timing } from "@/constants/animations";
import { Text } from "@/components/typography";
import { ChevronDownIcon } from "@/components/icons/button_icons";

interface DropdownSelectProps<T extends string> {
  label: ReactNode;
  options: T[];
  value: T;
  onValueChange: (value: T) => void;
  // Custom content of an option (e.g. a flag). Defaults to a field with the option in upper case.
  // width is the size computed from optionMinWidth / optionMaxWidth (undefined in the header).
  renderOption?: (option: T, selected: boolean, width?: number) => ReactNode;
  // With renderOption: options grow between these widths and are spread evenly,
  // they only wrap when they don't fit in one row at optionMinWidth.
  optionMinWidth?: number;
  optionMaxWidth?: number;
  activeColor?: string;
  optionColor?: string;
  textColor?: string;
  activeTextColor?: string;
  tabColor?: string;
}

// Settings row like ToggleButton; tapping it opens the options below the label.
export default function DropdownSelect<T extends string>({
  label,
  options,
  value,
  onValueChange,
  renderOption,
  optionMinWidth,
  optionMaxWidth,
  activeColor = "#b78358",
  optionColor = "#f4ede4",
  textColor = "#201c18",
  activeTextColor = "#ffffff",
  tabColor = "#ffffff",
}: DropdownSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [areaWidth, setAreaWidth] = useState(0);
  // 0 = closed, 1 = open; drives the height of the options, the arrow and the current value
  const progress = useSharedValue(0);
  // full height of the options (they are always rendered, so they can be measured)
  const optionsHeight = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, timing(ANIMATION_DURATION.dropdown)));
  }, [open, progress]);

  // The options area grows from 0 to its full height. Its real height changes,
  // so the rows below move along smoothly instead of jumping.
  const optionsStyle = useAnimatedStyle(() => ({
    height: progress.get() * optionsHeight.get(),
    opacity: progress.get(),
  }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.get() * 180}deg` }],
  }));
  // the current value fades out while the options are open (it keeps its space, so the row doesn't jump)
  const valueStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.get() }));
  const fit =
    renderOption && optionMinWidth != null && optionMaxWidth != null && areaWidth > 0
      ? fitOptions(options.length, areaWidth, optionMinWidth, optionMaxWidth)
      : undefined;

  const renderContent = (option: T, selected: boolean) =>
    renderOption ? (
      renderOption(option, selected)
    ) : (
      <Text style={{ color: selected ? activeTextColor : textColor }}>{option.toUpperCase()}</Text>
    );

  return (
    <View style={[styles.container, { backgroundColor: tabColor }]}>
      <Pressable
        onPress={() => setOpen(!open)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        {/* a string gets the default style; anything else (e.g. a SwapText) is shown as it is */}
        <View style={{ flex: 1 }}>
          {typeof label === "string" ? <Text style={{ color: textColor, fontSize: 16 }}>{label}</Text> : label}
        </View>
        <Animated.View style={valueStyle}>
          {renderOption ? (
            renderOption(value, true)
          ) : (
            <View style={[styles.field, { backgroundColor: activeColor }]}>
              {renderContent(value, true)}
            </View>
          )}
        </Animated.View>
        <Animated.View style={chevronStyle}>
          <ChevronDownIcon color={textColor} />
        </Animated.View>
      </Pressable>

      {/* clips the options to the animated height; closed options can't be tapped */}
      <Animated.View style={[styles.optionsClip, { pointerEvents: open ? "auto" : "none" }, optionsStyle]}>
        {/* absolute, so it keeps its full size and can be measured while the clip is smaller */}
        <View
          style={styles.optionsMeasure}
          onLayout={(e) => optionsHeight.set(e.nativeEvent.layout.height)}
          accessibilityElementsHidden={!open}
          importantForAccessibility={open ? "auto" : "no-hide-descendants"}
        >
        <View
          onLayout={(e) => setAreaWidth(e.nativeEvent.layout.width)}
          style={
            fit
              ? [styles.fittedOptions, { paddingHorizontal: fit.gap, columnGap: fit.gap, rowGap: fit.gap }]
              : styles.options
          }
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onValueChange(option);
                  setOpen(false);
                }}
                style={
                  renderOption
                    ? [styles.optionFrame, { backgroundColor: selected ? activeColor : "transparent" }]
                    : [styles.field, { backgroundColor: selected ? activeColor : optionColor }]
                }
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                {renderOption ? renderOption(option, selected, fit?.width) : renderContent(option, selected)}
              </Pressable>
            );
          })}
        </View>
        </View>
      </Animated.View>
    </View>
  );
}

const MIN_GAP = 8;

/**
 * Option width and gap so that the options sit in one row, evenly spaced (same gap between them
 * and to the edges). Below minWidth the row wraps; full rows then keep the same gap.
 */
function fitOptions(count: number, areaWidth: number, minWidth: number, maxWidth: number) {
  const outer = (width: number) => width + 2 * OPTION_FRAME_PADDING;
  let perRow = Math.max(count, 1);
  while (perRow > 1 && perRow * outer(minWidth) + (perRow + 1) * MIN_GAP > areaWidth) perRow--;
  const available = (areaWidth - (perRow + 1) * MIN_GAP) / perRow - 2 * OPTION_FRAME_PADDING;
  const width = Math.floor(Math.min(maxWidth, Math.max(minWidth, available)));
  const gap = Math.max(0, Math.floor((areaWidth - perRow * outer(width)) / (perRow + 1)));
  return { width, gap };
}

const OPTION_FRAME_PADDING = 3;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  field: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  // Selection ring around custom option content (e.g. flags)
  optionFrame: {
    padding: OPTION_FRAME_PADDING,
    borderRadius: 9,
  },
  optionsClip: {
    overflow: "hidden",
  },
  optionsMeasure: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
  },
  fittedOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

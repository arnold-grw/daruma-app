import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/typography";
import { ChevronDownIcon } from "@/components/icons/button_icons";

interface DropdownSelectProps<T extends string> {
  label: string;
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
        <Text style={{ color: textColor, fontSize: 16, flex: 1 }}>{label}</Text>
        {renderOption ? (
          renderOption(value, true)
        ) : (
          <View style={[styles.field, { backgroundColor: activeColor }]}>
            {renderContent(value, true)}
          </View>
        )}
        <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <ChevronDownIcon color={textColor} />
        </View>
      </Pressable>

      {open && (
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
      )}
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
  fittedOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
});

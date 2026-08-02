import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/typography";

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
  tabColor?: string;
}

export default function ToggleButton({
  label,
  value,
  onValueChange,
  activeColor = "#b78358",
  inactiveColor = "#d9c7b1",
  textColor = "#201c18",
  tabColor = "#ffffff"
}: ToggleButtonProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.container, {backgroundColor: tabColor}]}
      accessibilityRole="switch"
      accessibilityValue={{ text: value ? "on" : "off" }}
    >
      <Text style={{ color: textColor, fontSize: 16, flex: 1 }}>{label}</Text>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? activeColor : inactiveColor },
        ]}
      >
        <View style={[styles.thumb, value && styles.thumbActive]} />
      </View>
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
    width: 48,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
});

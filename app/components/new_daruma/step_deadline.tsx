// components/new_daruma/StepDeadline.tsx
import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/typography";
import { StepProps } from "@/app/daruma/new";
import useTheme from "@/constants/theme";
import { DatePicker } from "@/components/date_picker";

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function StepDeadline({ draft, setDraft, onValidChange, onConfirmLabelChange }: StepProps) {
  const { colors } = useTheme();
  const [date, setDate] = useState<Date | null>(
    draft.deadline ? new Date(draft.deadline) : null
  );

  useEffect(() => {
    onValidChange(true); // always skippable
    onConfirmLabelChange?.(date ? "Next" : "Skip");
  }, [date]);

  const handleChange = (selected: Date) => {
    // clamp to tomorrow if somehow below minimum
    const min = tomorrow();
    const clamped = selected < min ? min : selected;
    setDate(clamped);
    setDraft({ deadline: clamped.toISOString() });
  };

  const handleClear = () => {
    setDate(null);
    setDraft({ deadline: undefined });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 40, gap: 24 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Set a deadline?</Text>
      <Text style={{ color: colors.textSecondary, textAlign: "center", maxWidth: 280 }}>
        Optional — skip if you prefer no time limit.
      </Text>

      <DatePicker
        value={date}
        onChange={handleChange}
        minimumDate={tomorrow()}
      />

      <Text>date: {draft.deadline}</Text>

      {/* Only shown when a date is actively selected */}
      {date && (
        <Pressable
            onPress={handleClear}
            style={{
            paddingHorizontal: 40,
            paddingVertical: 20,
            borderRadius: 8,
            backgroundColor: colors.textSecondary,
            justifyContent: "center"
            }}
        >
            <Text style={{ color: colors.background, fontSize: 18}}>remove deadline</Text>
        </Pressable>
      )}
    </View>
  );
}
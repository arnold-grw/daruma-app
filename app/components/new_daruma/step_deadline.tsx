
import { DateView } from "@/components/date_view";
import { CenterModal } from "@/components/modals/CenterModal";
import { DatePicker } from "@/components/modals/date_picker";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { StepProps } from "@/types/step_props";
import { formatDate } from "@/utils/date_formatter";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export function StepDeadline({ draft, setDraft, onValidChange }: StepProps) {
  const { colors } = useTheme();
  const date = draft.deadline ? new Date(draft.deadline) : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date ?? tomorrow());

  useEffect(() => {
    onValidChange(true); // immer skippable, egal ob Datum gesetzt
  }, [date]);

  useEffect(() => {
    setSelectedDate(date ?? tomorrow());
  }, [date]);

  const handleClear = () => {
    setDraft({ deadline: undefined });
    setIsModalVisible(false);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 80, gap: 30 }}>
      <Text style={{ fontSize: 24, textAlign: "center" }}>Set a deadline?</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: "center", maxWidth: 280 }}>
        or skip if you prefer no time limit.
      </Text>

      <View style={{ flexDirection: "column", gap: 20, justifyContent: "center", maxWidth: 300, top: 40 }}>
        <DateView date={date ? formatDate(date.toISOString(), "DD/MM/YYYY") : undefined} onPressDate={() => setIsModalVisible(true)} />

        {date && (
          <Pressable
            onPress={handleClear}
            style={{
              paddingHorizontal: 40,
              paddingVertical: 20,
              borderRadius: 8,
              backgroundColor: colors.textSecondary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontSize: 18 }}>remove deadline</Text>
          </Pressable>
        )}
      </View>

      <CenterModal visible={isModalVisible} onClose={() => {
        setSelectedDate(date ?? tomorrow());
        setIsModalVisible(false);
      }}>
        {/*<Text style={{ fontSize: 20, textAlign: "center" }}>Choose a deadline</Text> */}
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          minDate={new Date()} //min date should be today instead of tomorrow because minDate itself is not included
          maxYearsAhead={20}
        />
        <View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
          {/*
          <Pressable
            onPress={() => {
              setSelectedDate(date ?? tomorrow());
              setIsModalVisible(false);
            }}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.textSecondary,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontSize: 16 }}>Cancel</Text>
          </Pressable>
          */}
          <Pressable
            onPress={() => {
              setDraft({ deadline: selectedDate.toISOString() });
              setIsModalVisible(false);
            }}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
              maxWidth: 230,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontSize: 16 }}>Choose</Text>
          </Pressable>
        </View>
      </CenterModal>
    </View>
  );
}
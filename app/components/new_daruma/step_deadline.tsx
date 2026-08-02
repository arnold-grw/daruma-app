
import { DateView } from "@/components/date_view";
import { CenterModal } from "@/components/modals/center_modal";
import { DatePicker } from "@/components/modals/date_picker";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { StepProps } from "@/types/step_props";
import { formatDate, getTomorrow } from "@/utils/date_formatter";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

export function StepDeadline({ draft, setDraft, onValidChange }: StepProps) {
  const { colors } = useTheme();
  const date = draft.deadline ? new Date(draft.deadline) : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date ?? getTomorrow());

  useEffect(() => {
    onValidChange(true); // immer skippable, egal ob Datum gesetzt
  }, [date]);

  useEffect(() => {
    setSelectedDate(date ?? getTomorrow());
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
        setSelectedDate(date ?? getTomorrow());
        setIsModalVisible(false);
      }}>
        <View style={{ flexDirection: "column", gap: 20, padding: 50, justifyContent: "center", alignItems: "center" }}>
          {/*<Text style={{ fontSize: 20, textAlign: "center", maxWidth: 280, padding: 20 }}>Until when do you want to reach your goal?</Text>*/}
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()} //min date should be today instead of tomorrow because minDate itself is not included
            maxYearsAhead={20}
            width={250}
          />
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
              width: 250,
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

import { DateView } from "@/components/date_view";
import { CenterModal } from "@/components/modals/center_modal";
import { BottomModal } from "@/components/modals/bottom_modal";
import { DatePicker } from "@/components/modals/date_picker";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { StepProps } from "@/types/step_props";
import { getTomorrow, parseDate, toDateKey } from "@/utils/date_formatter";
import { useEffect, useState } from "react";
import { Pressable, View, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";


export function StepDeadline({ draft, setDraft, onValidChange }: StepProps) {
  const { colors } = useTheme();
  const screenHeight = Dimensions.get("window").height;
  const date = draft.deadline ? parseDate(draft.deadline) : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(date ?? getTomorrow());

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  useEffect(() => {
    onValidChange(true); // immer skippable, egal ob Datum gesetzt
  }, []);

  // depends on the stored string, `date` is a new object on every render
  useEffect(() => {
    setSelectedDate(draft.deadline ? parseDate(draft.deadline) : getTomorrow());
  }, [draft.deadline]);

  const handleClear = () => {
    setDraft({ deadline: undefined });
    setIsModalVisible(false);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 80, gap: 30 }}>
      <Text style={{ fontSize: 24, textAlign: "center", maxWidth:300 }}>{t("new.deadline.title")}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: "center", maxWidth: 280 }}>
        {t("new.deadline.subtitle")}
      </Text>

      <View style={{ flexDirection: "column", gap: 20, justifyContent: "center", maxWidth: 300, top: 40 }}>
        <DateView date={date ?? undefined} onPressDate={() => setIsModalVisible(true)} />

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
            <Text style={{ color: colors.background, fontSize: 18 }}>{t("new.deadline.remove")}</Text>
          </Pressable>
        )}
      </View>

      <BottomModal visible={isModalVisible} onClose={() => {
        setSelectedDate(date ?? getTomorrow());
        setIsModalVisible(false);
      }}>
        <View style={{ flexDirection: "column", gap: 20, padding: 50, justifyContent: "center", alignItems: "center", marginBottom: (screenHeight/2) - 200 }}>
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
              setDraft({ deadline: toDateKey(selectedDate) });
              setIsModalVisible(false);
            }}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
              width: 250,
              minHeight: 50,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.background, fontSize: 16 }}>{t("new.deadline.choose")}</Text>
          </Pressable>
          </View>
      </BottomModal>
    </View>
  );
}
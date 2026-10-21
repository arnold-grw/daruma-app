// components/new_daruma/step_goal.tsx
import { Text, TextInput } from "@/components/typography";
import useTheme from "@/constants/theme";
import { StepProps } from "@/types/step_props";
import { useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

export function StepGoal({ draft, setDraft, onValidChange }: StepProps) {
  useEffect(() => {
    onValidChange(draft.goal.trim().length > 0);
  }, [draft.goal]);

  const colors = useTheme().colors;

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  return (
    <View style={{justifyContent: "flex-start", alignItems: "center", backgroundColor: colors.background, flex: 1, paddingTop: 80}}>
        <View style={{ alignItems: "center", paddingHorizontal: 20, gap: 16 }}>
            <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 20}}>{t("new.goal.title")}</Text>
            <TextInput
                placeholder={t("new.goal.placeholder")}
                placeholderTextColor={colors.textSecondary}
                value={draft.goal}
                onChangeText={(goal) => setDraft({ goal })}
                maxLength={40}
                style={{
                borderWidth: 2,
                borderColor: colors.textSecondary,
                padding: 10,
                width: 300,
                borderRadius: 8,
                }}
            />
            <TextInput
                placeholder={t("new.goal.notes")}
                placeholderTextColor={colors.textSecondary}
                value={draft.notes}
                onChangeText={(notes) => setDraft({ notes})}
                multiline={true}
                style={{
                borderWidth: 2,
                borderColor: colors.textSecondary,
                padding: 10,
                width: 300,
                borderRadius: 8,
                height: 120,
                textAlignVertical: 'top',
                }}
            />
        </View>
    </View>
  );
}
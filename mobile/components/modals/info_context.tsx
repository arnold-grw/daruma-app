import { Text, TextInput } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Daruma } from "@/types/daruma";
import { formatDate } from "@/utils/date_formatter";
import { localDateFormat } from "@/i18n/date_format";
import { useState } from "react";
import { TFunction } from "i18next";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

interface DarumaInfoContentProps {
  daruma: Daruma;
  onConfirmDelete: () => void;
  onChangeGoal: (newGoal: string) => void;
  onClose: () => void;
}

export const DarumaInfoContent = ({
  daruma,
  onConfirmDelete,
  onChangeGoal,
  onClose,
}: DarumaInfoContentProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmGoalChange, setConfirmGoalChange] = useState(false);
  const [draft, setDraft] = useState({ goal: daruma.goal });

  return (
    <View style={{ gap: 18, paddingBottom: 150 }}>
      {confirmDelete
        ? renderConfirmDeleteView(t, colors, onConfirmDelete, setConfirmDelete)
        : confirmGoalChange
          ? renderConfirmGoalChangeView(t, colors, draft, setDraft, setConfirmGoalChange, onChangeGoal)
          : renderDefaultView(t, daruma, colors, setConfirmGoalChange, setConfirmDelete, onClose)}
    </View>
  );
};

// Default view (Daruma info)
const renderDefaultView = (
  t: TFunction,
  daruma: Daruma,
  colors: any,
  setConfirmGoalChange: (value: boolean) => void,
  setConfirmDelete: (value: boolean) => void,
  onClose: () => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18 }}>
      {t("info.title")}
    </Text>
    <Text style={{ color: colors.textSecondary }}>
      {t("info.created", { date: formatDate(daruma.createdAt, localDateFormat(t, true)) })}
    </Text>
    {daruma.completedAt != null && (
      <Text style={{ color: colors.textSecondary }}>
        {t("info.completed", { date: formatDate(daruma.completedAt, localDateFormat(t, true)) })}
      </Text>
    )}
    {daruma.deadline != null && (
      <Text style={{ color: colors.textSecondary }}>
        {t("info.deadline", { date: formatDate(daruma.deadline, localDateFormat(t)) })}
      </Text>
    )}
    <Text style={{ color: colors.textSecondary }}>
      {t("info.updated", { date: formatDate(daruma.updatedAt, localDateFormat(t, true)) })}
    </Text>

    <Pressable
      onPress={() => setConfirmGoalChange(true)}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.text }}
    >
      <Text style={{ color: colors.text, textAlign: 'center', fontSize: 18 }}>
        {t("info.change_title")}
      </Text>
    </Pressable>
    <Pressable
      onPress={() => setConfirmDelete(true)}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.danger }}
    >
      <Text style={{ color: colors.danger, textAlign: 'center', fontSize: 18 }}>
        {t("info.delete")}
      </Text>
    </Pressable>

    {/*
    <Pressable onPress={onClose}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary }}>{t("common.cancel")}</Text>
    </Pressable>
    */}
  </>
);

// Confirm delete view
const renderConfirmDeleteView = (
  t: TFunction,
  colors: any,
  onConfirmDelete: () => void,
  setConfirmDelete: (value: boolean) => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18 }}>
      {t("info.delete_confirm_title")}
    </Text>
    <Text style={{ color: colors.textSecondary }}>
      {t("info.delete_confirm_text")}
    </Text>
    <Pressable
      onPress={onConfirmDelete}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, backgroundColor: colors.danger }}
    >
      <Text style={{ color: colors.background, textAlign: 'center', fontSize: 18 }}>
        {t("info.delete_confirm")}
      </Text>
    </Pressable>
    <Pressable onPress={() => setConfirmDelete(false)}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 18, marginTop: 10 }}>{t("common.go_back")}</Text>
    </Pressable>
  </>
);

// Confirm goal change view
const renderConfirmGoalChangeView = (
  t: TFunction,
  colors: any,
  draft: { goal: string },
  setDraft: (draft: { goal: string }) => void,
  setConfirmGoalChange: (value: boolean) => void,
  onChangeGoal: (newGoal: string) => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18 }}>
      {t("info.change_title_title")}
    </Text>
    <TextInput
      placeholder={t("info.change_title_placeholder")}
      placeholderTextColor={colors.textSecondary}
      value={draft.goal}
      onChangeText={(goal) => setDraft({ goal })}
      maxLength={36}
      style={{
        borderWidth: 2,
        borderColor: colors.textSecondary,
        padding: 14,
        borderRadius: 12,
        color: colors.text,
        marginTop: 8,
        fontSize: 16
      }}
    />
    <Pressable
      onPress={() => {
        if (draft.goal.trim().length === 0) {
          //alert("Goal cannot be empty.");
          return;
        }
        onChangeGoal(draft.goal);
        setConfirmGoalChange(false);
      }}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, backgroundColor: colors.primary }}
    >
      <Text style={{ color: colors.background, textAlign: 'center', fontSize: 18 }}>
        {t("info.save")}
      </Text>
    </Pressable>
    <Pressable onPress={() => setConfirmGoalChange(false)}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary, fontSize: 18, marginTop: 10 }}>{t("common.go_back")}</Text>
    </Pressable>
  </>
);
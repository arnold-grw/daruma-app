import { Text, TextInput } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Daruma } from "@/types/daruma";
import { DEFAULT_DATE_TIME_FORMAT, formatDate } from "@/utils/date_formatter";
import { useState } from "react";
import { Pressable, View } from "react-native";

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmGoalChange, setConfirmGoalChange] = useState(false);
  const [draft, setDraft] = useState({ goal: daruma.goal });

  return (
    <View style={{ gap: 18, paddingBottom: 150 }}>
      {confirmDelete
        ? renderConfirmDeleteView(colors, onConfirmDelete, setConfirmDelete)
        : confirmGoalChange
          ? renderConfirmGoalChangeView(colors, draft, setDraft, setConfirmGoalChange, onChangeGoal)
          : renderDefaultView(daruma, colors, setConfirmGoalChange, setConfirmDelete, onClose)}
    </View>
  );
};

// Default view (Daruma info)
const renderDefaultView = (
  daruma: Daruma,
  colors: any,
  setConfirmGoalChange: (value: boolean) => void,
  setConfirmDelete: (value: boolean) => void,
  onClose: () => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
      About your Daruma
    </Text>
    <Text style={{ color: colors.textSecondary }}>
      Created: {formatDate(daruma.createdAt, DEFAULT_DATE_TIME_FORMAT)}
    </Text>
    {daruma.completedAt != null && (
      <Text style={{ color: colors.textSecondary }}>
        Completed: {formatDate(daruma.completedAt, DEFAULT_DATE_TIME_FORMAT)}
      </Text>
    )}
    {daruma.deadline != null && (
      <Text style={{ color: colors.textSecondary }}>
        Deadline: {formatDate(daruma.deadline, DEFAULT_DATE_TIME_FORMAT)}
      </Text>
    )}
    <Text style={{ color: colors.textSecondary }}>
      Last Updated: {formatDate(daruma.updatedAt, DEFAULT_DATE_TIME_FORMAT)}
    </Text>

    <Pressable
      onPress={() => setConfirmGoalChange(true)}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.text }}
    >
      <Text style={{ color: colors.text, textAlign: 'center', fontWeight: '600' }}>
        Change Title
      </Text>
    </Pressable>
    <Pressable
      onPress={() => setConfirmDelete(true)}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.danger }}
    >
      <Text style={{ color: colors.danger, textAlign: 'center', fontWeight: '600' }}>
        Delete Daruma
      </Text>
    </Pressable>

    {/*
    <Pressable onPress={onClose}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Cancel</Text>
    </Pressable>
    */}
  </>
);

// Confirm delete view
const renderConfirmDeleteView = (
  colors: any,
  onConfirmDelete: () => void,
  setConfirmDelete: (value: boolean) => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
      Are you sure?
    </Text>
    <Text style={{ color: colors.textSecondary }}>
      This cannot be undone.
    </Text>
    <Pressable
      onPress={onConfirmDelete}
      style={{ marginTop: 8, padding: 14, borderRadius: 12, backgroundColor: colors.danger }}
    >
      <Text style={{ color: colors.background, textAlign: 'center', fontWeight: '600' }}>
        Yes, delete
      </Text>
    </Pressable>
    <Pressable onPress={() => setConfirmDelete(false)}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Go back</Text>
    </Pressable>
  </>
);

// Confirm goal change view
const renderConfirmGoalChangeView = (
  colors: any,
  draft: { goal: string },
  setDraft: (draft: { goal: string }) => void,
  setConfirmGoalChange: (value: boolean) => void,
  onChangeGoal: (newGoal: string) => void
) => (
  <>
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
      What shall it be?
    </Text>
    <TextInput
      placeholder="Enter new title"
      placeholderTextColor={colors.textSecondary}
      value={draft.goal}
      onChangeText={(goal) => setDraft({ goal })}
      maxLength={40}
      style={{
        borderWidth: 2,
        borderColor: colors.textSecondary,
        padding: 14,
        borderRadius: 12,
        color: colors.text,
        marginTop: 8,
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
      <Text style={{ color: colors.background, textAlign: 'center', fontWeight: '600' }}>
        Save Changes
      </Text>
    </Pressable>
    <Pressable onPress={() => setConfirmGoalChange(false)}>
      <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Go back</Text>
    </Pressable>
  </>
);
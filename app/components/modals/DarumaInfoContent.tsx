import { Pressable, View } from "react-native";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Daruma } from "@/types/daruma";
import { formatDate, DEFAULT_DATE_FORMAT } from "@/utils/date_formatter";
import { useState } from "react";

interface DarumaInfoContentProps {
  daruma: Daruma;
  onConfirmDelete: () => void;
  onClose: () => void;
}

export const DarumaInfoContent = ({
  daruma,
  onConfirmDelete,
  onClose,
}: DarumaInfoContentProps) => {
  const { colors } = useTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      {!confirmDelete ? (
        <>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
            About your Daruma
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            Created: {formatDate(daruma.createdAt, DEFAULT_DATE_FORMAT)}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            Updated: {formatDate(daruma.updatedAt, DEFAULT_DATE_FORMAT)}
          </Text>
          <Pressable
            onPress={() => setConfirmDelete(true)}
            style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.danger }}
          >
            <Text style={{ color: colors.danger, textAlign: 'center', fontWeight: '600' }}>
              Delete Daruma
            </Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Cancel</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
            Are you sure?
          </Text>
          <Text style={{ color: colors.textSecondary }}>This cannot be undone.</Text>
          <Pressable
            onPress={onConfirmDelete}
            style={{ padding: 14, borderRadius: 12, backgroundColor: colors.danger }}
          >
            <Text style={{ color: colors.background, textAlign: 'center', fontWeight: '600' }}>
              Yes, delete
            </Text>
          </Pressable>
          <Pressable onPress={() => setConfirmDelete(false)}>
            <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Go back</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};
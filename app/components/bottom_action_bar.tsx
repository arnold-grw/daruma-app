import { View, Pressable } from "react-native";
import { Text } from '@/components/typography';
import { router } from "expo-router";
import useTheme from "@/constants/theme";

interface Props {
  showConfirm?: boolean
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export default function BottomActionBar({ showConfirm = true, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel" }: Props) {

  const { colors } = useTheme();

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: colors.card,
      }}
    >
      {/* Cancel */}
      <Pressable
        onPress={() => router.back()}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: colors.text,
        }}
      >
        <Text style={{ color: colors.text }}>{cancelLabel}</Text>
      </Pressable>

      {/* Confirm */}
      {showConfirm && (
      <Pressable
        onPress={onConfirm}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
          backgroundColor: colors.primary,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {confirmLabel}
        </Text>
      </Pressable>
      )}
    </View>
  );
}
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import useTheme from "@/constants/theme";

interface Props {
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
}

export default function BottomActionBar({ onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel" }: Props) {

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
          borderWidth: 1,
          borderColor: colors.text,
        }}
      >
        <Text style={{ color: colors.text }}>{cancelLabel}</Text>
      </Pressable>

      {/* Confirm */}
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
    </View>
  );
}
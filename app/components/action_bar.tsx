import { Text } from '@/components/typography';
import useTheme, { shadowStyle } from "@/constants/theme";
import { safeBack } from "@/utils/navigation";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  showConfirm?: boolean
  canConfirm?: boolean
  onConfirm: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  canClick?: boolean
}

export default function BottomActionBar({ showConfirm = true, canConfirm = true, onConfirm, onCancel, confirmLabel, cancelLabel, canClick = true }: Props) {
  const { t } = useTranslation();

  const { colors, shadows } = useTheme();

  // Default cancel handler: safeBack(): router.back() or router.push("/")
  const handleCancel = onCancel || (() => safeBack());

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        width: "100%",
        height: 85 + insets.bottom,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingVertical: 20,
        paddingBottom: insets.bottom,
        backgroundColor: colors.card,
        ...shadowStyle(shadows)
      }}
    >
      {/* Cancel */}
      <Pressable
        onPress={canClick ? handleCancel : undefined}
        style={{
          paddingHorizontal: 20,
          borderRadius: 8,
          borderWidth: 3,
          borderColor: colors.text,
          height: 50,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: colors.text, fontSize: 18}}>{cancelLabel ?? t("common.cancel")}</Text>
      </Pressable>

      {/* Confirm */}
      {showConfirm && (
      <Pressable
        onPress={canConfirm ? onConfirm : undefined}
        disabled={!canConfirm || !canClick}
        style={{
          paddingHorizontal: 20,
          borderRadius: 8,
          height: 50,
          backgroundColor: canConfirm ? colors.primary : colors.textSecondary,
          justifyContent: "center"
        }}
      >
        <Text style={{ color: colors.background, fontSize: 18 }}>
          {confirmLabel ?? t("common.confirm")}
        </Text>
      </Pressable>
      )}
    </View>
  );
}
import useTheme, { shadowStyle } from "@/constants/theme";
import { Modal, Pressable, View } from "react-native";
import { CloseIcon } from "../icons/button_icons";

interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CenterModal = ({ visible, onClose, children }: CenterModalProps) => {
  const { colors, shadows } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* dark overlay */}
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
        onPress={onClose}
      />
      {/* content */}
      <View
        style={{
          pointerEvents: 'box-none',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: colors.background,
            borderRadius: 24,
            padding: 24,
            gap: 16,
            ...shadowStyle(shadows, { x_offset: 0, y_offset: 0, opacity: 0.5, radius: 40 })
          }}
        >
          <Pressable onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
            <CloseIcon color={colors.textSecondary} />
          </Pressable>
          {children}
        </View>
      </View>
    </Modal>
  );
};
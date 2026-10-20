import useTheme, { shadowStyle } from "@/constants/theme";
import { Modal, Pressable } from "react-native";
import { CloseIcon } from "../icons/button_icons";
import KeyboardShift from "../keyboard_shift";

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomModal = ({ visible, onClose, children }: BottomModalProps) => {
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
      {/* content, moves up with the keyboard so text fields stay visible */}
      <KeyboardShift
        style={{
          pointerEvents: 'box-none',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          gap: 16,
          ...shadowStyle(shadows, { x_offset: 0, y_offset: 0, opacity: 0.75, radius: 40 })
        }}
      >
        <Pressable onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
          <CloseIcon color={colors.textSecondary} />
        </Pressable>
        {children}
      </KeyboardShift>
    </Modal>
  );
};

import useTheme, { shadowStyle } from "@/constants/theme";
import { Modal, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { CloseIcon } from "../icons/button_icons";
import KeyboardShift from "../keyboard_shift";
import { useModalTransition } from "./use_modal_transition";

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomModal = ({ visible, onClose, children }: BottomModalProps) => {
  const { colors, shadows } = useTheme();
  const { mounted, progress } = useModalTransition(visible);
  // measured height of the sheet; large until measured so the sheet starts off screen
  const sheetHeight = useSharedValue(1000);

  // overlay fades in, the sheet slides up from below the screen
  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.get()) * sheetHeight.get() }],
  }));

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      {/* dark overlay */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }, overlayStyle]} />
      </Pressable>
      {/* sliding part; the content inside also moves up with the keyboard so text fields stay visible */}
      <Animated.View
        onLayout={(e) => sheetHeight.set(e.nativeEvent.layout.height)}
        style={[styles.sheet, sheetStyle]}
      >
        <KeyboardShift
          style={{
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
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // box-none: taps next to the sheet reach the overlay (on web this only works in StyleSheet.create, not inline)
  sheet: {
    pointerEvents: 'box-none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

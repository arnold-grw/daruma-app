import useTheme, { shadowStyle } from "@/constants/theme";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { CloseIcon } from "../icons/button_icons";
import { useModalTransition } from "./use_modal_transition";

// size of the card when the animation starts (1 = full size)
const START_SCALE = 0.92;

interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CenterModal = ({ visible, onClose, children }: CenterModalProps) => {
  const { colors, shadows } = useTheme();
  const { mounted, progress } = useModalTransition(visible);

  // overlay fades in, the card fades in while growing to full size
  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ scale: interpolate(progress.get(), [0, 1], [START_SCALE, 1]) }],
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
      {/* content */}
      <View style={styles.content}>
        <Animated.View
          style={[{
            width: '100%',
            backgroundColor: colors.background,
            borderRadius: 24,
            padding: 24,
            gap: 16,
            ...shadowStyle(shadows, { x_offset: 0, y_offset: 0, opacity: 0.5, radius: 40 })
          }, cardStyle]}
        >
          <Pressable onPress={onClose} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
            <CloseIcon color={colors.textSecondary} />
          </Pressable>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // box-none: taps next to the card reach the overlay (on web this only works in StyleSheet.create, not inline)
  content: {
    pointerEvents: 'box-none',
    flex: 1,
    justifyContent: 'center',
  },
});

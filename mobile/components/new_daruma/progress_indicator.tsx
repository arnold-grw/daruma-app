import { ANIMATION_DURATION, timing } from "@/constants/animations";
import useTheme from "@/constants/theme";
import { useEffect } from "react";
import { BACK_ICON_STROKE, CloseIcon } from "@/components/icons/button_icons";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ✕ and bars are centered together; longest bar of one step, on narrow screens the bars get shorter so the ✕ fits next to them
const SEGMENT_MAX_WIDTH = 70;
// space between the close button and the bars, and to the screen edges
const CLOSE_GAP = 15;
// size of the ✕; its lines are as thick as the back arrow in the daruma view
const CLOSE_ICON_SIZE = 20;
const CLOSE_STROKE = BACK_ICON_STROKE;

interface Props {
    stepIndex: number;
    totalSteps: number;
    // with onClose an ✕ sits left of the bars, at their height
    onClose?: () => void;
}

export function ProgressIndicator({ stepIndex, totalSteps, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 + insets.top, marginBottom: 5,
            paddingHorizontal: onClose ? CLOSE_GAP : 0, gap: CLOSE_GAP }}>
            {onClose && (
                <Pressable onPress={onClose} hitSlop={15}>
                    <CloseIcon color={colors.primary} size={CLOSE_ICON_SIZE} strokeWidth={CLOSE_STROKE} />
                </Pressable>
            )}
            <View style={{ flexDirection: 'row', gap: 5, flexShrink: 1, width: totalSteps * SEGMENT_MAX_WIDTH + (totalSteps - 1) * 5 }}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <Segment key={index} filled={index <= stepIndex} />
                ))}
            </View>
        </View>
    );
}

// One bar of the indicator. When it becomes filled, the color grows from left to right;
// when going back it shrinks again from right to left.
function Segment({ filled }: { filled: boolean }) {
    const { colors } = useTheme();
    // 0 = empty, 1 = filled
    const fill = useSharedValue(filled ? 1 : 0);

    useEffect(() => {
        fill.set(withTiming(filled ? 1 : 0, timing(ANIMATION_DURATION.progressFill)));
    }, [filled, fill]);

    const fillStyle = useAnimatedStyle(() => ({ width: `${fill.get() * 100}%` }));

    return (
        <View style={{ flex: 1, height: 15, borderRadius: 7.5, backgroundColor: colors.card, overflow: 'hidden' }}>
            <Animated.View style={[{ height: '100%', borderRadius: 5, backgroundColor: colors.primary }, fillStyle]} />
        </View>
    );
}

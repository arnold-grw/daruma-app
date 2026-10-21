import { ANIMATION_DURATION, timing } from "@/constants/animations";
import useTheme from "@/constants/theme";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ProgressIndicator({ stepIndex, totalSteps }: { stepIndex: number; totalSteps: number }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 + insets.top, gap: 5, marginBottom: 5 }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <Segment key={index} filled={index <= stepIndex} />
            ))}
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
        <View style={{ width: 70, height: 10, borderRadius: 5, backgroundColor: colors.card, overflow: 'hidden' }}>
            <Animated.View style={[{ height: '100%', borderRadius: 5, backgroundColor: colors.primary }, fillStyle]} />
        </View>
    );
}

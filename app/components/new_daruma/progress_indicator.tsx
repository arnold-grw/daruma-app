import useTheme from "@/constants/theme";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ProgressIndicator({ stepIndex, totalSteps }: { stepIndex: number; totalSteps: number }) {
    const { colors, shadows } = useTheme();

    const insets = useSafeAreaInsets();


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 + insets.top, gap: 5, marginBottom: 5 }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                        style={{
                        width: 70,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: index <= stepIndex ? colors.primary : colors.card,
                        //shadowColor: shadows.color, shadowOffset: { width: shadows.x_offset, height: shadows.y_offset }, shadowOpacity: 0.25, shadowRadius: shadows.radius, elevation: shadows.elevation
                    }}
                >
                </View>
            ))}
        </View>
    );
}
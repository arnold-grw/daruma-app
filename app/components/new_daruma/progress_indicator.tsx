import useTheme from "@/constants/theme";
import { View } from "react-native";

export function ProgressIndicator({ stepIndex, totalSteps }: { stepIndex: number; totalSteps: number }) {
    const { colors, shadows } = useTheme();


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 5 }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                        style={{
                        width: 60,
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
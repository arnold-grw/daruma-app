import useTheme from "@/constants/theme";
import { View } from "react-native";

export function ProgressIndicator({ stepIndex, totalSteps }: { stepIndex: number; totalSteps: number }) {
    const { colors } = useTheme();


    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 5 }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                        style={{
                        width: 80,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: index <= stepIndex ? colors.primary : colors.card,
                    }}
                >
                </View>
            ))}
        </View>
    );
}
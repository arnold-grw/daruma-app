import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Pressable, View } from "react-native";

interface Props {
    date?: string;
    onPressDate: () => void;
}

export function DateView({ date, onPressDate }: Props) {
    const { colors } = useTheme();

    return (
        <Pressable
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: 70,
                minWidth: 150,
                padding: 16,
                backgroundColor: colors.background,
                borderColor: colors.textSecondary,
                borderWidth: 3,
                borderRadius: 10,
            }}
            onPress={onPressDate}
        >
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                paddingHorizontal: 10,
            }}>
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                    {date?.split("/")[0] ?? "DD"}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                    {date?.split("/")[1] ?? "MM"}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                    {date?.split("/")[2] ?? "YYYY"}
                </Text>
            </View>
        </Pressable>
    );
}
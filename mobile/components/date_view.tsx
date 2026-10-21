import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { DatePart, localDateOrder } from "@/i18n/date_format";

interface Props {
    date?: Date;
    onPressDate: () => void;
}

export function DateView({ date, onPressDate }: Props) {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const labels: Record<DatePart, string> = {
        day: date ? String(date.getDate()).padStart(2, "0") : t("date.placeholder_day"),
        month: date ? t(`date.months.${date.getMonth()}`) : t("date.placeholder_month"),
        year: date ? String(date.getFullYear()) : t("date.placeholder_year"),
    };

    return (
        <Pressable
            style={{
                alignItems: "center",
                justifyContent: "center",
                height: 70,
                minWidth: 250,
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
                {localDateOrder(t).map((part) => (
                    <Text key={part} style={{ color: colors.text, fontSize: 18 }}>
                        {labels[part]}
                    </Text>
                ))}
            </View>
        </Pressable>
    );
}

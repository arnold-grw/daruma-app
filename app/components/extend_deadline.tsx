import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { DEFAULT_DATE_FORMAT, formatDate, getTomorrow } from "@/utils/date_formatter";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { BottomModal } from "./modals/bottom_modal";
import { DatePicker } from "./modals/date_picker";

interface ExtendDeadlineProps {
  deadline: string;
  onConfirm: (newDeadline: string) => void;
}

export default function ExtendDeadline( { deadline, onConfirm }: ExtendDeadlineProps) {
    const { colors } = useTheme();
    const [modalVisible, setIsModalVisible] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(getTomorrow());

    return (
        <View style={{ alignItems: 'center', gap: 4, borderWidth: 2, borderColor: colors.danger, borderRadius: 8, width: 300 }}>
            <Text style={{ color: colors.danger, fontSize: 18, paddingVertical: 10, textAlign: 'center' }}>
                Overdue since: {formatDate(deadline, DEFAULT_DATE_FORMAT)}
            </Text>
            <Pressable style={{ backgroundColor: colors.danger, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, width: 300, alignItems: 'center', borderColor: colors.danger, borderWidth: 2 }} onPress={() => setIsModalVisible(true)}>
                <Text style={{ color: colors.background, fontSize: 18 }}>
                    Extend deadline
                </Text>
            </Pressable>

            <BottomModal visible={modalVisible} onClose={() => setIsModalVisible(false)}>
                <View style={{ alignItems: 'center', gap: 20, paddingBottom: 150 }}>
                    <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
                        Extend deadline
                    </Text>
                    <DatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        minDate={new Date()} //min date should be today instead of tomorrow because minDate itself is not included
                        maxYearsAhead={20}
                    />
                    <Pressable
                        onPress={() => {
                            onConfirm(selectedDate.toISOString());
                            setIsModalVisible(false);
                        }}
                        style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 12,
                        backgroundColor: colors.primary,
                        width: 250,
                        alignItems: "center",
                        }}
                    >
                        <Text style={{ color: colors.background, fontSize: 16 }}>Confirm</Text>
                    </Pressable>
                </View>
            </BottomModal>
        </View>
    );
}
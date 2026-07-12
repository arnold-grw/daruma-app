// components/ui/DatePicker.tsx
//import RNDatePicker from "@dietime/react-native-date-picker";
import { Picker, Text } from '@/components/typography';
import useTheme from "@/constants/theme";
import { View } from "react-native";

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DatePicker({ value, onChange, minimumDate }: Props) {
  const { colors } = useTheme();
  const fallback = minimumDate ?? new Date();

  return (
    <View>
      <Text>set date here</Text>
      <Picker
        items={[
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" }
        ]}
        placeholder="Select a date"
      />
    </View>
  );
}
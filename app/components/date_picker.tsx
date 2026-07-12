// components/ui/DatePicker.tsx
//import RNDatePicker from "@dietime/react-native-date-picker";
import useTheme from "@/constants/theme";
import { Text } from '@/components/typography';

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export function DatePicker({ value, onChange, minimumDate }: Props) {
  const { colors } = useTheme();
  const fallback = minimumDate ?? new Date();

  return (
    <Text>set date here</Text>
  );
}
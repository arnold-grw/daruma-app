import { WheelPicker } from "@/components/wheel_picker";
import useTheme from "@/constants/theme";
import { getMonthString } from "@/utils/date_formatter";
import { useMemo } from "react";
import { View } from "react-native";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxYearsAhead?: number;
  width: number;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function DatePicker({ value, onChange, minDate, maxYearsAhead = 10, width = 250 }: DatePickerProps) {

  const { colors, shadows } = useTheme();
  const currentYear = new Date().getFullYear();

  const years = useMemo(
    () => Array.from({ length: maxYearsAhead + 1 }, (_, i) => currentYear + i),
    [currentYear, maxYearsAhead]
  );

  const day = value.getDate();
  const month = value.getMonth();
  const year = value.getFullYear();

  const isMinYear = minDate ? year === minDate.getFullYear() : false;
  const minMonth = isMinYear ? minDate!.getMonth() : 0;
  const visibleMonths = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i).filter((m) => m >= minMonth),
    [minMonth]
  );

  const maxDay = daysInMonth(year, month);
  const isMinYearMonth = isMinYear && month === minDate!.getMonth();
  const minDay = isMinYearMonth ? minDate!.getDate() + 1 : 1;
  const visibleDays = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1).filter((d) => d >= minDay),
    [maxDay, minDay]
  );

  const dayIndex = Math.max(0, visibleDays.indexOf(day));
  const monthIndex = Math.max(0, visibleMonths.indexOf(month));
  const yearIndex = Math.max(0, years.indexOf(year));

  const updateDate = (newDay: number, newMonth: number, newYear: number) => {
    const maxD = daysInMonth(newYear, newMonth);
    const clampedDay = Math.min(newDay, maxD);
    let next = new Date(newYear, newMonth, clampedDay);

    if (minDate && next <= minDate) {
      next = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() + 1);
    }
    onChange(next);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: 12,
        width: width,
        borderColor: colors.border, borderWidth: 3,
        //shadowColor: shadows.color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 40, elevation: shadows.elevation
      }}
    >
      <WheelPicker
        items={visibleDays}
        selectedIndex={dayIndex}
        onChange={(i) => updateDate(visibleDays[i], month, year)}
        renderLabel={(d) => String(d).padStart(2, "0")}
        width={60}
      />
      <WheelPicker
        items={visibleMonths}
        selectedIndex={monthIndex}
        onChange={(i) => updateDate(day, visibleMonths[i], year)}
        renderLabel={(m) => getMonthString(m)}
        width={60}
      />
      <WheelPicker
        items={years}
        selectedIndex={yearIndex}
        onChange={(i) => updateDate(day, month, years[i])}
        renderLabel={(y) => String(y)}
        width={90}
      />
    </View>
  );
}
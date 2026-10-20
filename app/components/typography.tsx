
import useTheme from '@/constants/theme';
import { Picker as RNPicker, type PickerProps } from "@react-native-picker/picker";
import React from "react";
import { Text as RNText, TextInput as RNTextInput, StyleSheet, type StyleProp, type TextInputProps, type TextProps, type TextStyle } from 'react-native';

// M PLUS Rounded 1c Bold (Latin, Japanese, Cyrillic), registered in app/_layout.tsx. All texts use this one cut.
export const FONT = 'MPLUSRounded1c_700Bold';

// fontWeight has no effect with a single custom font file, and on Android it can
// make the text fall back to the system font, so it is removed from the style.
function withFont(style: StyleProp<TextStyle>, color: string) {
  const { fontWeight, ...rest } = StyleSheet.flatten(style) ?? {};
  return [{ fontFamily: FONT, color }, rest];
}

export function Text({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      style={withFont(style, colors.text)}
      {...props}
    />
  );
}

export function TextInput({ style, ...props }: TextInputProps) {
  const { colors } = useTheme();
  return (
    <RNTextInput
      style={withFont(style, colors.text)}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

interface CustomPickerProps extends PickerProps {
  items: { label: string; value: string }[];
  placeholder?: string;
}

export function Picker({ style, items, ...props }: CustomPickerProps) {
  const { colors } = useTheme();

  return (
    <RNPicker
      style={[{ fontFamily: FONT, color: colors.text, borderRadius: 8, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.background, fontSize: 16 }, style]}
      dropdownIconColor={colors.textSecondary}
      {...props}
    >
      {items.map((item) => (
        <RNPicker.Item
          key={item.value}
          label={item.label}
          value={item.value}
          color={colors.text}
          fontFamily={FONT}
        />
      ))}
    </RNPicker>
  );
}
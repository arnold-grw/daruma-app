
import useTheme from '@/constants/theme';
import { Picker as RNPicker, type PickerProps } from "@react-native-picker/picker";
import React from "react";
import { Text as RNText, TextInput as RNTextInput, type TextInputProps, type TextProps } from 'react-native';

const FONT = 'MyFont';

export function Text({ style, ...props }: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      style={[{ fontFamily: FONT, color: colors.text }, style]}
      {...props}
    />
  );
}

export function TextInput({ style, ...props }: TextInputProps) {
  const { colors } = useTheme();
  return (
    <RNTextInput
      style={[{ fontFamily: FONT, color: colors.text }, style]}
      placeholderTextColor={colors.textSecondary}
      {...props}
    />
  );
}

interface CustomPickerProps extends PickerProps {
  items: { label: string; value: string }[];
  placeholder?: string;
}

export function Picker({ style, items, placeholder, ...props }: CustomPickerProps) {
  const { colors } = useTheme();

  return (
    <RNPicker
      style={[{ fontFamily: FONT, color: colors.text }, style]}
      dropdownIconColor={colors.textSecondary}
      {...props}
    >
      {placeholder && (
        <RNPicker.Item
          label={placeholder}
          value={null}
          color={colors.textSecondary}
          enabled={false}
        />
      )}
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
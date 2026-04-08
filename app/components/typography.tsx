import { Text as RNText, TextInput as RNTextInput, type TextProps, type TextInputProps } from 'react-native';
import useTheme from '@/constants/theme';

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
import { useColorScheme } from "react-native";

export default function useTheme() {
  const scheme = useColorScheme();

  const colors = lightColors;
  const shadows = shadowValues;

  return { colors, scheme, shadows };
}

export const lightColors = {
  background: "#f2edea",
  card: "#dccdbf",
  primary: "#b78358",
  text: "#201c18",
  textSecondary: "#8e847c",
  border: "#e6d3bc",
  danger: "#FF4B4B",
};

export const darkColors = {
  background: "#1f1f20",
  card: "#2C2C2E",
  primary: "#009ba6",
  text: "#FFFFFF",
  textSecondary: "#B3B3B3",
  border: "#353537",
  danger: "#FF4B4B",
};

export const shadowValues = {
  color: '#000',
  opacity: 0.33,
  x_offset: 0,
  y_offset: 0,
  radius: 20,
  elevation: 5,
}
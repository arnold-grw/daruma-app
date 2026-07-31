import { useColorScheme } from "react-native";

export default function useTheme() {
  const scheme = useColorScheme();
  const darkmode = true;

  var colors = lightColors;
  var shadows = darkShadows;
  if (darkmode) {
    colors = darkColors;
    shadows = brightShadows;
  }

  return { colors, scheme, shadows, darkmode };
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
  card: "#5a5651",
  primary: "#d1ae91",
  text: "#FFFFFF",
  textSecondary: "#B3B3B3",
  border: "#353537",
  danger: "#e66262",
};

export const darkShadows = {
  color: '#000',
  opacity: 0.33,
  x_offset: 0,
  y_offset: 0,
  radius: 20,
  elevation: 5,
}

export const brightShadows = {
  color: '#e4e4e4',
  opacity: 0.33,
  x_offset: 0,
  y_offset: 0,
  radius: 20,
  elevation: 5,
}
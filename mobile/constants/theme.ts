
import { useThemeStore } from "@/store/theme_store";
import { Platform, TextStyle } from "react-native";

export default function useTheme() {
  const scheme = useThemeStore((state) => state.scheme);
  const setScheme = useThemeStore((state) => state.setScheme);
  const toggleScheme = useThemeStore((state) => state.toggleScheme);

  const darkmode = scheme === "dark";
  const colors = darkmode ? darkColors : lightColors;
  const shadows = darkmode ? brightShadows : darkShadows;

  return {
    colors,
    scheme,
    setScheme,
    toggleScheme,
    shadows,
    darkmode,
  };
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

export type Shadows = typeof darkShadows;
// TextStyle contains all view props, so the result fits View and Text styles
type ShadowStyle = Pick<TextStyle, "boxShadow" | "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation">;

// "#rgb" / "#rrggbb" + opacity -> "rgba(r, g, b, opacity)"
function withOpacity(hex: string, opacity: number) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Shadow style for a theme shadow, single values can be overridden.
// The web uses boxShadow (the shadow* props are deprecated there), iOS and Android keep shadow* and elevation.
export function shadowStyle(shadows: Shadows, overrides: Partial<Shadows> = {}): ShadowStyle {
  const { color, opacity, x_offset, y_offset, radius, elevation } = { ...shadows, ...overrides };
  if (Platform.OS === "web") {
    return { boxShadow: `${x_offset}px ${y_offset}px ${radius}px ${withOpacity(color, opacity)}` };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: x_offset, height: y_offset },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}

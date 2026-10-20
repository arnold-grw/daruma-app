import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import { Text } from "@/components/typography";
import { LangPref } from "@/types/user";

// Shared look of all flags (and of the fallback box)
export const FLAG_WIDTH = 36; // default width
export const FLAG_MIN_WIDTH = 36;
export const FLAG_MAX_WIDTH = 54;
export const FLAG_RATIO = 3 / 4; // height / width, all SVGs in assets/flags are 4:3
export const FLAG_RADIUS = 6;
export const FLAG_BORDER_WIDTH = 2;

// Languages without an entry here show the fallback box with the language code
const FLAGS: Partial<Record<LangPref, ImageSource>> = {
  en: require("@/assets/flags/usa.svg"), // alternative: uk.svg
  de: require("@/assets/flags/germany.svg"),
  fr: require("@/assets/flags/france.svg"),
  es: require("@/assets/flags/spain.svg"),
  ja: require("@/assets/flags/japan.svg"),
  zh: require("@/assets/flags/chinese.svg"), // alternative: chinese.svg (language icon 中)
};

interface FlagProps {
  lang: LangPref;
  width?: number;
  // Colors of the fallback box
  boxColor?: string;
  textColor?: string;
  // Optional outline drawn on top of the flag
  borderColor?: string;
}

export default function Flag({ lang, width = FLAG_WIDTH, boxColor = "#f4ede4", textColor = "#201c18", borderColor }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const source = FLAGS[lang];
  const showFlag = source != null && !failed;

  return (
    <View style={[styles.frame, { width, height: width * FLAG_RATIO }, !showFlag && { backgroundColor: boxColor }]}>
      {showFlag ? (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          onError={() => setFailed(true)}
          accessibilityLabel={lang.toUpperCase()}
        />
      ) : (
        <Text style={{ color: textColor, fontSize: Math.round(width * 0.36) }}>{lang.toUpperCase()}</Text>
      )}
      {borderColor != null && (
        <View style={[styles.border, { borderColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: FLAG_RADIUS,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    position: "absolute",
    pointerEvents: "none",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: FLAG_RADIUS,
    borderWidth: FLAG_BORDER_WIDTH,
  },
});

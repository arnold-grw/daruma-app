// components/new_daruma/StepColor.tsx
import ColorPicker from "@/components/color_picker";
import { DARUMA_ASPECT } from "@/components/daruma/daruma_details";
import { Text } from "@/components/typography";
import { DARUMA_COLORS, getDarumaColor, getRemainingUnlocks, isColorUnlocked } from "@/constants/daruma_colors";
import { useCompletedDarumaCount } from "@/store/user_store";
import useTheme from "@/constants/theme";
import { DarumaColor } from "@/types/daruma";
import { StepProps } from "@/types/step_props";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { useSwapTransition } from "@/components/swap_text";
import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// Height kept free for the title above and the color name below the daruma (incl. a minimum gap)
const TEXT_SPACE = 220;
// Largest daruma width, relative to the screen width and absolute (tablets)
const MAX_WIDTH_RATIO = 0.8;
const MAX_WIDTH = 480;

export function StepColor({ draft, setDraft, onValidChange}: StepProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [areaHeight, setAreaHeight] = useState(0);
  // the daruma is as large as the width allows, but shrinks on short screens (e.g. iPhone SE)
  // so the texts above and below still fit
  const fitsWidth = Math.min(windowWidth * MAX_WIDTH_RATIO, MAX_WIDTH);
  const fitsHeight = areaHeight > 0 ? (areaHeight - TEXT_SPACE) / DARUMA_ASPECT : fitsWidth;
  const darumaSize = Math.max(0, Math.min(fitsWidth, fitsHeight));
  const { colors, shadows, darkmode } = useTheme();
  // the color whose name is shown: changes already while swiping, as soon as a daruma is more than halfway in the middle
  // (draft.color only changes when the carousel snaps)
  const [previewColor, setPreviewColor] = useState(draft.color);
  // the name fades out and the new one fades in; shownColor follows previewColor after the fade-out
  const { shown: shownColor, style: swapStyle } = useSwapTransition(previewColor);
  const colorConfig = getDarumaColor(shownColor);
  const completedCount = useCompletedDarumaCount();
  const lockedColors = DARUMA_COLORS.map((c) => c.id).filter((id) => !isColorUnlocked(id, completedCount));
  const remainingUnlocks = getRemainingUnlocks(colorConfig.id, completedCount);

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  // locked colors can be looked at, but not chosen. The color in the middle while swiping counts too,
  // so "next" can't be pressed for a locked color before the carousel snaps
  useEffect(() => {
    onValidChange(isColorUnlocked(draft.color, completedCount) && isColorUnlocked(previewColor, completedCount));
  }, [draft.color, previewColor, completedCount, onValidChange]);

  const handleSelect = (color: DarumaColor) => {
    setDraft({ color });
  };

  // black text would not be visible on black, locked colors are not shown in their color yet
  const labelColor = colorConfig.id === 'black' || remainingUnlocks > 0 ? colors.text : colorConfig.hex;

  return (
    // The two text areas share the space left by the daruma equally (flex: 1 each), and center their text,
    // so the title sits in the middle between progress bar and daruma, the color name between daruma and action bar.
    <View style={{ flex: 1, alignItems: "center" }} onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 24, textAlign: "center", paddingHorizontal: 20}}>{t("new.color.title")}</Text>
      </View>
      <ColorPicker
        selected={draft.color}
        onSelect={handleSelect}
        onPreview={setPreviewColor}
        size={darumaSize}
        lockedColors={lockedColors}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* No exiting layout animation here: on web the exiting copy is placed off-center */}
        <Animated.View style={[{ alignItems: "center", gap: 4 }, swapStyle]}>
          <Text style={{ color: labelColor, fontSize: 24 }}>
            {t(colorConfig.labelKey)}
          </Text>
          {/* locked: how to unlock it instead of the meaning */}
          <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", paddingHorizontal: 20 }}>
            {remainingUnlocks > 0 ? t("new.color.locked", { count: remainingUnlocks }) : t(colorConfig.meaningKey)}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

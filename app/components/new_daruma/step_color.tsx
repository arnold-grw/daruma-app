// components/new_daruma/StepColor.tsx
import ColorPicker from "@/components/color_picker";
import { Text } from "@/components/typography";
import { getDarumaColor } from "@/constants/daruma_colors";
import useTheme from "@/constants/theme";
import { DarumaColor } from "@/types/daruma";
import { StepProps } from "@/types/step_props";
import { useEffect } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

export function StepColor({ draft, setDraft, onValidChange}: StepProps) {
  const { colors, shadows, darkmode } = useTheme();
  const colorConfig = getDarumaColor(draft.color);

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  useEffect(() => {
    onValidChange(true); // color always has a default, always valid
  }, []);

  const handleSelect = (color: DarumaColor) => {
    setDraft({ color });
  };

  const colorLabel = darkmode && colorConfig.id == 'black' ? (
    <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>
      {t(colorConfig.labelKey)}
    </Text>
  ) : (
    <Text style={{ color: colorConfig.hex, fontSize: 18, fontWeight: "600" }}>
      {t(colorConfig.labelKey)}
    </Text>
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 20, paddingHorizontal: 20}}>{t("new.color.title")}</Text>
      <ColorPicker
        selected={draft.color}
        onSelect={handleSelect}
      />
      <View style={{ alignItems: "center", gap: 4 }}>
        {colorLabel}
        <Text style={{ color: colors.textSecondary }}>
          {t(colorConfig.meaningKey)}
        </Text>
      </View>
    </View>
  );
}
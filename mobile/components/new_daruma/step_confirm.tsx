// components/new_daruma/step_confirm.tsx
import { DarumaDisplay } from "@/components/daruma/daruma_display";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { createDaruma } from "@/domain/daruma_domain";
import { Daruma } from "@/types/daruma";
import { StepProps } from "@/types/step_props";
import { formatDate } from "@/utils/date_formatter";
import { localDateFormat } from "@/i18n/date_format";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { DARUMA_ASPECT } from "@/components/daruma/daruma_details";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// Height kept free for the title above and goal + deadline below the daruma (incl. a minimum gap)
const TEXT_SPACE = 240;
// Largest daruma width, relative to the screen width and absolute
const MAX_WIDTH_RATIO = 0.8;
const MAX_WIDTH = 315;

export function StepConfirm({ draft }: StepProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [areaHeight, setAreaHeight] = useState(0);
  // the daruma shrinks on short screens so the texts above and below still fit
  const fitsWidth = Math.min(windowWidth * MAX_WIDTH_RATIO, MAX_WIDTH);
  const fitsHeight = areaHeight > 0 ? (areaHeight - TEXT_SPACE) / DARUMA_ASPECT : fitsWidth;
  const darumaSize = Math.max(0, Math.min(fitsWidth, fitsHeight));

  const colors = useTheme().colors;
  const showDaruma: Daruma = draft.goal?.trim().length > 0
  ? createDaruma(draft, "preview")
  : {
      id: "preview",
      userId: "preview",
      goal: draft.goal ?? "",
      color: draft.color ?? "red",
      notes: draft.notes ?? "",
      deadline: draft.deadline,
      isCompleted: false,
      isFailed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leftEyeDrawing: draft.leftEyeDrawing
    };

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  return (
    // The two text areas share the space left by the daruma equally (flex: 1 each) and center their text,
    // so the title sits in the middle between progress bar and daruma, goal and deadline between daruma and action bar.
    <View
      style={{ alignItems: "center", backgroundColor: colors.background, flex: 1}}
      onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
    >
        <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ fontSize: 24, textAlign: "center", paddingHorizontal: 20 }}>{t("new.confirm.title")}</Text>
        </View>
        <DarumaDisplay daruma={showDaruma} width={darumaSize} height={darumaSize * DARUMA_ASPECT} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", maxWidth: 280 }}>
                <Text style={{ color: colors.text, fontSize:20 }}> {showDaruma.goal}</Text>
            </Text>
            {showDaruma.deadline && (
                <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", maxWidth: 280 }}>
                    {t("new.confirm.due_until")}
                    <Text style={{ color: colors.text, fontSize:20 }}> {formatDate(showDaruma.deadline, localDateFormat(t))}</Text>
                </Text>
            )}
        </View>
    </View>
  );
}
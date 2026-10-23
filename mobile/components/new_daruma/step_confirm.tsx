// components/new_daruma/step_confirm.tsx
import Daruma3D, { VIEW_HEIGHT_RATIO } from "@/components/3d/daruma_model";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { createDaruma } from "@/domain/daruma_domain";
import { Daruma } from "@/types/daruma";
import { StepProps } from "@/types/step_props";
import { formatDate } from "@/utils/date_formatter";
import { localDateFormat } from "@/i18n/date_format";
import { useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// Height kept free for the title above and goal + deadline below the daruma (incl. a minimum gap)
const TEXT_SPACE = 240;
// Largest daruma height, relative to the screen width and absolute (the 3D view itself is screen wide)
const MAX_SIZE_RATIO = 0.9;
const MAX_SIZE = 400;

export function StepConfirm({ draft }: StepProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [areaHeight, setAreaHeight] = useState(0);
  // the daruma shrinks on short screens so the texts above and below still fit
  const fitsWidth = Math.min(windowWidth * MAX_SIZE_RATIO, MAX_SIZE);
  const fitsHeight = areaHeight > 0 ? (areaHeight - TEXT_SPACE) / VIEW_HEIGHT_RATIO : fitsWidth;
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
        {/* 3D daruma with the painted eye; drag sideways to turn it, tap to make it wobble */}
        <Daruma3D
          color={showDaruma.color}
          leftEye={draft.leftEyeDrawing}
          size={darumaSize}
        />
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

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
import { LayoutChangeEvent, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// the elements share the free height evenly (same as in the daruma view); smallest gap between them and to the top and bottom
const MIN_GAP = 12;
const EDGE_SPACE = 20;
// on short screens the daruma shrinks so everything fits, but not below this size
const MIN_SIZE = 140;
// Largest daruma height, relative to the screen width and absolute (the 3D view itself is screen wide)
const MAX_SIZE_RATIO = 0.9;
const MAX_SIZE = 400;

export function StepConfirm({ draft }: StepProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [areaHeight, setAreaHeight] = useState(0);
  // measured height of every element except the daruma, so the daruma can take the rest
  const [heights, setHeights] = useState<Record<string, number>>({});
  const measure = (key: string) => (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    setHeights((h) => (h[key] === height ? h : { ...h, [key]: height }));
  };

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

  const shownKeys = ["title", "goal", ...(showDaruma.deadline ? ["deadline"] : [])];
  const othersHeight = shownKeys.reduce((sum, key) => sum + (heights[key] ?? 0), 0);
  // free height for the daruma: the area minus the texts and the smallest gaps (one gap per text, plus top and bottom)
  const fitsHeight = areaHeight - 2 * EDGE_SPACE - othersHeight - shownKeys.length * MIN_GAP;
  // the daruma grows with the screen width, but not beyond MAX_SIZE, and shrinks on short screens
  const fitsWidth = Math.min(windowWidth * MAX_SIZE_RATIO, MAX_SIZE);
  const darumaSize = areaHeight > 0 ? Math.max(MIN_SIZE, Math.min(fitsWidth, fitsHeight)) : fitsWidth;
  // the 3D view is higher than the daruma (room for wobbling); this empty band is not counted as space
  const darumaBand = darumaSize * (VIEW_HEIGHT_RATIO - 1) / 2;

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  return (
    // The elements are spread evenly over the height (same as in the daruma view); the daruma takes what is left (see darumaSize)
    <View
      style={{ alignItems: "center", justifyContent: "space-evenly", gap: MIN_GAP, paddingVertical: EDGE_SPACE,
        backgroundColor: colors.background, flex: 1 }}
      onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
    >
        <Text onLayout={measure("title")} style={{ fontSize: 24, textAlign: "center", paddingHorizontal: 20 }}>{t("new.confirm.title")}</Text>
        {/* 3D daruma with the painted eye; drag sideways to turn it, tap to make it wobble */}
        <Daruma3D
          color={showDaruma.color}
          leftEye={draft.leftEyeDrawing}
          size={darumaSize}
          style={{ marginVertical: -darumaBand }}
        />
        <Text onLayout={measure("goal")} style={{ color: colors.text, fontSize: 20, textAlign: "center", maxWidth: 280 }}>
            {showDaruma.goal}
        </Text>
        {showDaruma.deadline && (
            <Text onLayout={measure("deadline")} style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", maxWidth: 280 }}>
                {t("new.confirm.due_until")}
                <Text style={{ color: colors.text, fontSize:20 }}> {formatDate(showDaruma.deadline, localDateFormat(t))}</Text>
            </Text>
        )}
    </View>
  );
}

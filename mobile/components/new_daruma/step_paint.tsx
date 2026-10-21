// components/new_daruma/StepPaint.tsx
import { DarumaDetails } from "@/components/daruma/daruma_details";
import { DrawingSpace } from "@/components/drawing/drawing_space";
import { Text } from "@/components/typography";
import useTheme, { shadowStyle } from "@/constants/theme";
import { Drawing } from "@/types/drawing";
import { StepProps } from "@/types/step_props";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// size of the drawing area (the eye)
const DRAWING_SIZE = 300;
// how far the title is moved up from its centered position, and its minimum distance to the top
const TITLE_LIFT = 100;
const TITLE_MIN_TOP = 45;

export function StepPaint({ draft, setDraft, onValidChange }: StepProps) {
  const { colors, shadows } = useTheme();
  const drawingSpaceRef = useRef<any>(null);
  const [areaHeight, setAreaHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  // Title and drawing area are centered as one column; the title is then lifted by TITLE_LIFT,
  // but never so far that it gets closer than TITLE_MIN_TOP to the top (short screens).
  const centeredTop = (areaHeight - titleHeight - DRAWING_SIZE) / 2;
  const titleOffset = areaHeight > 0 ? Math.max(-TITLE_LIFT, TITLE_MIN_TOP - centeredTop) : -TITLE_LIFT;

  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  useEffect(() => {
    // If there's already a draft drawing, mark valid, otherwise require drawing
    const hasDraft = !!draft.leftEyeDrawing && draft.leftEyeDrawing.lines.length > 0;
    onValidChange(hasDraft);
  }, []);

  // Called by new.tsx before moving to next step
  // Expose via ref so parent can pull drawing data on confirm
  const getDrawingData = () => {
    if (drawingSpaceRef.current) {
      const drawingData = drawingSpaceRef.current.getDrawingData();
      if (drawingData) {
        setDraft({ leftEyeDrawing: drawingData });
      }
    }
  };

  const handleDrawingChange = (drawing: Drawing) => {
    const hasLines = drawing.lines.length > 0;
    onValidChange(hasLines);
    if (hasLines) {
      setDraft({
        leftEyeDrawing: {
          lines: drawing.lines.map(line => ({
            points: line.points.map(p => ({ x: p.x, y: p.y })),
            width: line.width,
          }))
        }
      });
    } else {
      // clear draft when nothing is drawn
      setDraft({ leftEyeDrawing: undefined });
    }
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden"}}
      onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
    >
      <Text
        onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}
        style={{
        fontSize: 24,
        textAlign: "center",
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        maxWidth: 300,
        padding: 20,
        borderRadius: 10,
        top: titleOffset,
        ...shadowStyle(shadows)
      }}>
        {t("new.paint.title")}
      </Text>

      <View style={{ zIndex: -1 }}>
        <View style={{
          position: "absolute",
          top: "50%",
          transform: [{ translateX: -691 }, { translateY: -435 }],
        }}>
          <DarumaDetails color={draft.color} width={315 * 4} height={324 * 4} />
        </View>
        <DrawingSpace
          ref={drawingSpaceRef}
          size={DRAWING_SIZE}
          onDrawingChange={handleDrawingChange}
          initialDrawing={draft.leftEyeDrawing}
        />
      </View>
    </View>
  );
}
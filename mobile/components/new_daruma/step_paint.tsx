// components/new_daruma/StepPaint.tsx
import { DarumaDetails } from "@/components/daruma/daruma_details";
import { drawingLayout, DrawingSpace } from "@/components/drawing/drawing_space";
import { PaintTitle, usePaintLayout } from "@/components/drawing/paint_title";
import { Drawing } from "@/types/drawing";
import { StepProps } from "@/types/step_props";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// size of the drawing area (the eye)
const DRAWING_SIZE = 300;

export function StepPaint({ draft, setDraft, onValidChange }: StepProps) {
  const drawingSpaceRef = useRef<any>(null);
  const [areaHeight, setAreaHeight] = useState(0);
  // on narrow screens the canvas moves left to make room for the toolbar
  const { width: windowWidth } = useWindowDimensions();
  const { canvasShift } = drawingLayout(windowWidth, DRAWING_SIZE);
  // title above the canvas; on short screens the canvas moves down to make room for it
  const paintLayout = usePaintLayout(areaHeight, DRAWING_SIZE);

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
      {/* the drawing area is centered, the title sits in the middle of the space above it */}
      <PaintTitle text={t("new.paint.title")} layout={paintLayout} />

      <View style={{ zIndex: -1, transform: [{ translateX: canvasShift }, { translateY: paintLayout.canvasOffsetY }] }}>
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
// components/new_daruma/StepPaint.tsx
import { DarumaDetails } from "@/components/daruma/daruma_details";
import { DrawingSpace } from "@/components/drawing/drawing_space";
import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { Drawing } from "@/types/drawing";
import { StepProps } from "@/types/step_props";
import { useEffect, useRef } from "react";
import { View } from "react-native";

export function StepPaint({ draft, setDraft, onValidChange }: StepProps) {
  const { colors, shadows } = useTheme();
  const drawingSpaceRef = useRef<any>(null);

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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
      <Text style={{
        fontSize: 24,
        textAlign: "center",
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        maxWidth: 300,
        padding: 20,
        borderRadius: 10,
        top: -100,
        shadowColor: shadows.color, shadowOffset: { width: shadows.x_offset, height: shadows.y_offset }, shadowOpacity: shadows.opacity, shadowRadius: shadows.radius, elevation: shadows.elevation
      }}>
        Paint the left eye to begin your journey
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
          size={300}
          onDrawingChange={handleDrawingChange}
          initialDrawing={draft.leftEyeDrawing}
        />
      </View>
    </View>
  );
}
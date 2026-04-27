// components/new_daruma/StepPaint.tsx
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { Text } from "@/components/typography";
import { StepProps } from "@/app/daruma/new";
import useTheme from "@/constants/theme";
import { DarumaDetails } from "@/components/daruma/daruma_details";
import { DrawingSpace } from "@/components/drawing/drawing_space";
import { Drawing } from "@/types/drawing"

export function StepPaint({ draft, setDraft, onValidChange }: StepProps) {
  const { colors } = useTheme();
  const drawingSpaceRef = useRef<any>(null);

  useEffect(() => {
    onValidChange(false); // must draw something to proceed
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
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Text style={{
        fontSize: 24,
        textAlign: "center",
        paddingHorizontal: 20,
        backgroundColor: colors.background,
        maxWidth: 300,
        padding: 20,
        borderRadius: 10,
      }}>
        Paint the left eye to start your Journey
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
          //ref={drawingSpaceRef}
          size={300}
          onDrawingChange={handleDrawingChange}
        />
      </View>
    </View>
  );
}
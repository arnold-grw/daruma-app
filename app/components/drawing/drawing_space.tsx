import { Canvas } from "@/components/drawing/canvas";
import { Toolbar } from "@/components/drawing/toolbar";
import { Drawing, DrawingData, DrawingSettings, Line, Point } from "@/types/drawing";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";

export const DrawingSpace = forwardRef(({ 
  size = 300,
  onDrawingChange,
  initialDrawing,
}: { 
  size?: number,
  onDrawingChange?: (drawing: Drawing) => void,
  initialDrawing?: DrawingData,
}, ref) => {
  const convertDrawingData = (data?: DrawingData): Drawing => {
    if (!data) return new Drawing();
    const lines = data.lines.map(l => new Line(l.points.map(p => new Point(p.x, p.y)), l.width ?? 0.5));
    return new Drawing(lines);
  }

  const [currentDrawing, setCurrentDrawing] = useState<Drawing>(() => convertDrawingData(initialDrawing));
  const [settings, setSettings] = useState<DrawingSettings>({ thickness: 0.2 });
  const canvasRef = useRef<any>(null); // Ref to access Canvas methods

  // Update thickness in settings
  const handleThicknessChange = (value: number) => {
    setSettings({ ...settings, thickness: value });
  };

  // Call Canvas's undo function via ref
  const handleRemoveLastLine = () => {
    if (canvasRef.current) {
      canvasRef.current.undoLastLine();
    }
  };

  // Handle drawing changes from Canvas
  const handleDrawingChange = (drawing: Drawing) => {
    setCurrentDrawing(drawing);
    onDrawingChange?.(drawing);
  };

  // Expose drawing data getter via ref
  useImperativeHandle(ref, () => ({
    getDrawingData: (): DrawingData | null => {
      if (currentDrawing && currentDrawing.lines.length > 0) {
        console.log("points in first line: "+currentDrawing.lines[0].points.length);
        return {
          lines: currentDrawing.lines.map(line => ({
            points: line.points.map(point => ({ x: point.x, y: point.y })),
            width: line.width
          }))
        };
      }
      return null;
    },
  }));

  return (
    <View style={{ flexDirection: "row" }}>
      <Canvas
        ref={canvasRef}
        size={size}
        settings={settings}
        onDrawingChange={handleDrawingChange}
        initialDrawing={initialDrawing}
      />
      <Toolbar
        height={size*1.25}
        width={75}
        settings={settings}
        onThicknessChange={handleThicknessChange}
        onRemoveLastLine={handleRemoveLastLine}
      />
    </View>
  );
});
import { View } from "react-native";
import { DrawingSettings, Drawing, DrawingData } from "@/types/drawing";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@/components/drawing/canvas";
import { Toolbar } from "@/components/drawing/toolbar";

export const DrawingSpace = forwardRef(({ size = 300 }: { size?: number }, ref) => {
  const [currentDrawing, setCurrentDrawing] = useState<Drawing>(new Drawing());
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
  };

  // Expose drawing data getter via ref
  useImperativeHandle(ref, () => ({
    getDrawingData: (): DrawingData | null => {
      if (currentDrawing && currentDrawing.lines.length > 0) {
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
      />
      <Toolbar
        height={size}
        width={75}
        settings={settings}
        onThicknessChange={handleThicknessChange}
        onRemoveLastLine={handleRemoveLastLine}
      />
    </View>
  );
});
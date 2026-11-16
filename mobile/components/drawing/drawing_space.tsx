import { Canvas } from "@/components/drawing/canvas";
import { PEN_SIZES, TOOL_BOX_SIZE, Toolbar } from "@/components/drawing/toolbar";
import { Drawing, DrawingData, DrawingSettings, Line, Point } from "@/types/drawing";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";

// the toolbar is as wide as its boxes (TOOL_BOX_SIZE in toolbar.tsx)
const TOOLBAR_WIDTH = TOOL_BOX_SIZE;
// height of the drawing space compared to the canvas (room below the canvas; the paint screens'
// background and title placement are tuned to it)
const SPACE_HEIGHT_RATIO = 1.25;

// smallest gap between canvas and toolbar while the canvas is still centered on the screen
const MIN_TOOLBAR_GAP = 16;

// Height of the drawing space; the canvas sits at its top
export const drawingSpaceHeight = (size: number) => size * SPACE_HEIGHT_RATIO;

/**
 * Where canvas and toolbar go on a screen of the given width. The toolbar sits in the middle between canvas and
 * right screen edge. The canvas is centered on the screen while the toolbar still has MIN_TOOLBAR_GAP on both sides;
 * on narrower screens (most phones) the canvas moves left, so the gaps left of the canvas, between canvas and toolbar
 * and right of the toolbar are all the same.
 * canvasShift: how far the canvas moves from the screen center (px, negative = left);
 * the parents apply it to the view holding the DrawingSpace and its background, so both move together.
 * toolbarLeft: toolbar position from the left edge of the canvas (px).
 */
export function drawingLayout(windowWidth: number, size: number) {
  const centeredLeft = (windowWidth - size) / 2;
  const centeredGap = (centeredLeft - TOOLBAR_WIDTH) / 2;
  const gap = centeredGap >= MIN_TOOLBAR_GAP ? centeredGap : Math.max((windowWidth - size - TOOLBAR_WIDTH) / 3, 0);
  const canvasLeft = centeredGap >= MIN_TOOLBAR_GAP ? centeredLeft : gap;
  return { canvasShift: canvasLeft - centeredLeft, toolbarLeft: size + gap };
}

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
  const [settings, setSettings] = useState<DrawingSettings>({ thickness: PEN_SIZES[1] });
  const canvasRef = useRef<any>(null); // Ref to access Canvas methods
  const { width: windowWidth } = useWindowDimensions();

  const { toolbarLeft } = drawingLayout(windowWidth, size);

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
    // only as wide as the canvas (the parents center it and move it by canvasShift); the toolbar hangs out to the right
    <View style={{ width: size, height: drawingSpaceHeight(size) }}>
      <Canvas
        ref={canvasRef}
        size={size}
        settings={settings}
        onDrawingChange={handleDrawingChange}
        initialDrawing={initialDrawing}
      />
      {/* vertically centered next to the canvas */}
      <View style={{ position: "absolute", top: 0, height: size, justifyContent: "center", left: toolbarLeft }}>
        <Toolbar
          width={TOOLBAR_WIDTH}
          settings={settings}
          onThicknessChange={handleThicknessChange}
          onRemoveLastLine={handleRemoveLastLine}
        />
      </View>
    </View>
  );
});
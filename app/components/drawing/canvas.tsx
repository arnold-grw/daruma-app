import { Pressable, View, Text } from "react-native";
import { Point, Line, Drawing, DrawingSettings } from "@/types/drawing";
import { DrawingRenderer } from "./drawing_renderer";
import { TEST_DARUMA } from "@/constants/test_data";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";


interface Props {
  size: number;
  settings: DrawingSettings;
  onDrawingChange?: (drawing: Drawing) => void;
}

export const Canvas = forwardRef(({ size = 200, settings, onDrawingChange }: Props, ref) => {
    const canvasRef = useRef<View>(null);
    const canvasOrigin = useRef({ x: 0, y: 0 });
    const [drawing, setDrawing] = useState(new Drawing());
    const [liveDrawing, setLiveDrawing] = useState(new Drawing());
    const currentLineRef = useRef<Line | null>(null);
    const drawingSpaceFactor = 0.75;
    const drawingSpaceSize = size * drawingSpaceFactor;
    const { thickness } = settings;
    const minDistance = 0.05; // Minimum distance in normalized coordinates to add a new point

    const measureCanvas = () => {
        canvasRef.current?.measure((x, y, width, height, pageX, pageY) => {
        canvasOrigin.current = { x: pageX, y: pageY };
        });
    };

    const transformCoordinates = (canvasX: number, canvasY: number): Point => {
        const normalizedX = (canvasX / size) * 2 - 1;
        const normalizedY = -1 * ((canvasY / size) * 2 - 1);
        return new Point(normalizedX, normalizedY);
    };

    const isInCanvas = (inputX: number, inputY: number): boolean => {
        const point = transformCoordinates(inputX, inputY);
        //return point.x >= -1 && point.x <= 1 && point.y >= -1 && point.y <= 1; //square canvas
        return point.distanceTo(new Point(0, 0)) <= drawingSpaceFactor; //circular canvas check
    }

    const updateLiveDrawing = (line: Line) => {
        setLiveDrawing(new Drawing([...drawing.lines, line]));
    }

    const clearCanvas = () => {
        setDrawing(new Drawing());
        setLiveDrawing(new Drawing());
    }

    useImperativeHandle(ref, () => ({
        undoLastLine: () => {
        if (drawing.lines.length === 0) return;
        const newLines = drawing.lines.slice(0, -1);
        setDrawing(new Drawing(newLines));
        setLiveDrawing(new Drawing(newLines));
        },
    }));

    const startDrawing = (inputX: number, inputY: number) => {
        if (!isInCanvas(inputX, inputY)) return;
        const point = transformCoordinates(inputX, inputY);
        currentLineRef.current = new Line([point, point], thickness);
        updateLiveDrawing(currentLineRef.current);
    }

    const whileDrawing = (inputX: number, inputY: number) => {
        if (!currentLineRef.current) return;
        if (!isInCanvas(inputX, inputY)) {
            endDrawing(inputX, inputY);
            return;
        }
        const point = transformCoordinates(inputX, inputY);
        const lastPoint = currentLineRef.current.points[currentLineRef.current.points.length - 1];
        if (point.distanceTo(lastPoint) < minDistance) return;

        currentLineRef.current.addPoint(point);
        updateLiveDrawing(currentLineRef.current);

        //console.log("While Drawing at:", point);
    }

    const endDrawing = (inputX: number, inputY: number) => {
        if (!currentLineRef.current) return;
        if (isInCanvas(inputX, inputY)) {
            const point = transformCoordinates(inputX, inputY);
            currentLineRef.current.addPoint(point);
            updateLiveDrawing(currentLineRef.current);
        }
        const newDrawing = new Drawing([...drawing.lines, currentLineRef.current]);
        setDrawing(newDrawing);
        onDrawingChange?.(newDrawing);
        currentLineRef.current = null;
    }



  return (
    <View
      ref={canvasRef}
      style={{ width: size, height: size }}
      onLayout={measureCanvas} // re-measure whenever layout changes
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        measureCanvas(); // also re-measure on touch start, layout may have shifted
        const { pageX, pageY } = event.nativeEvent; // ← use pageX/pageY
        startDrawing(
          pageX - canvasOrigin.current.x,
          pageY - canvasOrigin.current.y
        );
      }}
      onResponderMove={(event) => {
        const { pageX, pageY } = event.nativeEvent;
        whileDrawing(
          pageX - canvasOrigin.current.x,
          pageY - canvasOrigin.current.y
        );
      }}
      onResponderRelease={(event) => {
        const { pageX, pageY } = event.nativeEvent;
        endDrawing(
          pageX - canvasOrigin.current.x,
          pageY - canvasOrigin.current.y
        );
      }}
    >
        <View style={{
            position: "absolute",
            width: drawingSpaceSize,
            height: drawingSpaceSize,
            backgroundColor: "white",
            borderRadius: drawingSpaceSize/2,
            transform: [
                { translateX: size/2 - drawingSpaceSize/2 },
                { translateY: size/2 - drawingSpaceSize/2 },
            ]
        }}/>

        <View style={{ position: "absolute", width: size, height: size }}
        pointerEvents="none">
        <DrawingRenderer
            drawingData={liveDrawing}
            width={size}
            height={size}
        />
        </View>

    </View>
  );
});

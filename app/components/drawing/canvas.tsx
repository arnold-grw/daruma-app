import { Pressable, View, Text } from "react-native";
import { Point, Line, Drawing } from "@/types/drawing";
import { DrawingRenderer } from "./drawing_renderer";
import { TEST_DARUMA } from "@/constants/test_data";
import { useRef, useState } from "react";


interface Props {
  size: number;
}

export function Canvas({ size = 200 }: Props) {
    const [drawing, setDrawing] = useState(new Drawing());
    const [liveDrawing, setLiveDrawing] = useState(new Drawing());
    const currentLineRef = useRef<Line | null>(null);
    var drawingSpaceFactor = 0.75;
    var drawingSpaceSize = size * drawingSpaceFactor;
    var thickness = 0.5;
    var minDistance = 0.1; // Minimum distance in normalized coordinates to add a new point

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

    const undoLastLine = () => {
        if (drawing.lines.length === 0) return;
        const newLines = drawing.lines.slice(0, -1);
        setDrawing(new Drawing(newLines));
        setLiveDrawing(new Drawing(newLines));
    }

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
        }
        const newDrawing = new Drawing([...drawing.lines, currentLineRef.current]);
        setDrawing(newDrawing);
        currentLineRef.current = null;
    }



  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 2,
        borderColor: "red"
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        const { locationX, locationY } = event.nativeEvent;
        startDrawing(locationX, locationY);
      }}
      onResponderMove={(event) => {
        const { locationX, locationY } = event.nativeEvent;
        whileDrawing(locationX, locationY);
      }}
      onResponderRelease={(event) => {
        const { locationX, locationY } = event.nativeEvent;
        endDrawing(locationX, locationY);
      }}
    >
        <View style={{
            position: "absolute",
            width: drawingSpaceSize,
            height: drawingSpaceSize,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "black",
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
}

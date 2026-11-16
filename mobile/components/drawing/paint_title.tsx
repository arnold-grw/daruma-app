import { drawingSpaceHeight } from "@/components/drawing/drawing_space";
import { Text } from "@/components/typography";
import useTheme, { shadowStyle } from "@/constants/theme";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

// wanted gap above and below the title: on short screens the canvas moves down until this gap fits (if there is room).
// The title itself always sits exactly in the middle between the top of the area and the canvas.
const TITLE_GAP = 60;

/**
 * Layout of the paint screens: the drawing space is centered in the area and the title sits in the middle
 * of the space above the canvas. On short screens (e.g. iPhone SE) that space is too small for the title,
 * so the drawing space moves down (canvasOffsetY) until the title fits above it, but the canvas never leaves the area.
 * areaHeight: height of the area the drawing space is centered in; drawingSize: canvas size of the DrawingSpace.
 */
export function usePaintLayout(areaHeight: number, drawingSize: number) {
  const [titleHeight, setTitleHeight] = useState(0);

  // without the offset, the canvas (at the top of the drawing space) starts here
  const centeredTop = (areaHeight - drawingSpaceHeight(drawingSize)) / 2;
  const neededTop = titleHeight + 2 * TITLE_GAP;
  // the canvas may move down until it touches the bottom of the area (the empty part of the drawing space below it may leave the area)
  const maxOffset = areaHeight - drawingSize - centeredTop;
  const canvasOffsetY = Math.max(0, Math.min(neededTop - centeredTop, maxOffset));
  const canvasTop = centeredTop + canvasOffsetY;
  const titleTop = Math.max(0, (canvasTop - titleHeight) / 2);

  return {
    canvasOffsetY,
    titleTop,
    onTitleLayout: (e: LayoutChangeEvent) => setTitleHeight(e.nativeEvent.layout.height),
    // both heights known, so nothing jumps into place any more
    ready: areaHeight > 0 && titleHeight > 0,
  };
}

interface PaintTitleProps {
  text: string;
  // from usePaintLayout
  layout: ReturnType<typeof usePaintLayout>;
  shadowOpacity?: number;
}

/** Title box of the paint screens, placed by usePaintLayout. Must be placed in the area the drawing space is centered in. */
export function PaintTitle({ text, layout, shadowOpacity }: PaintTitleProps) {
  const { colors, shadows } = useTheme();

  return (
    <View style={{ position: "absolute", top: layout.titleTop, left: 0, right: 0, alignItems: "center", zIndex: 1,
      opacity: layout.ready ? 1 : 0 }}>
      <Text
        onLayout={layout.onTitleLayout}
        style={{
          fontSize: 24,
          textAlign: "center",
          backgroundColor: colors.background,
          maxWidth: 300,
          padding: 20,
          borderRadius: 10,
          ...shadowStyle(shadows, shadowOpacity !== undefined ? { opacity: shadowOpacity } : undefined),
        }}
      >
        {text}
      </Text>
    </View>
  );
}

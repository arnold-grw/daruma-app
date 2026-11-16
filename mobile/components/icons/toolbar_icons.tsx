import Svg, { Path } from 'react-native-svg';

const ICON_SIZE = 35;
const STROKE_WIDTH = 4;

export function UndoIcon({ color, size = ICON_SIZE }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        // arrow head pointing left, then the line goes right and curves back down (classic undo arrow)
        d="M9 5L4 10l5 5M4 10h10.5a5 5 0 0 1 0 10H11"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BrushIcon({ color }: { color: string }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      {/* Handle */}
      <Path
        d="M4 4 L14 14"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        transform="scale(-1, 1) translate(-24, 0)"
      />
      {/* Bristle tip */}
      <Path
        d="M14 14 Q18 15 19 19 Q15 18 14 14"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        transform="scale(-1, 1) translate(-24, 0)"
      />
    </Svg>
  );
}
import Svg, { Path } from 'react-native-svg';

const ICON_SIZE = 35;
const STROKE_WIDTH = 4;

export function UndoIcon({ color }: { color: string }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 7l-5 5 5 5M9 12H19"
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
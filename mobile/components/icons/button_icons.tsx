import Svg, { Path } from 'react-native-svg';

const ICON_SIZE = 20;
const STROKE_WIDTH = 4;

// size of the back arrow in the daruma view
export const BACK_ICON_SIZE = 28;
// line thickness of the back arrow in px on screen (STROKE_WIDTH in the 24 x 24 box, scaled to BACK_ICON_SIZE)
export const BACK_ICON_STROKE = STROKE_WIDTH * BACK_ICON_SIZE / 24;

// strokeWidth is given in px on screen (default: same thickness as before, STROKE_WIDTH at ICON_SIZE)
export function CloseIcon({ color, size = ICON_SIZE, strokeWidth }: { color: string; size?: number; strokeWidth?: number }) {
  // the paths are drawn in a 24 x 24 box, so the stroke is scaled back from px into that box
  const stroke = strokeWidth != null ? strokeWidth * 24 / size : STROKE_WIDTH;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 3 l 18 18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 2 21 l 18 -18"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronDownIcon({ color }: { color: string }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 5 9 l 7 7 l 7 -7"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ color, size = ICON_SIZE }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 13 4 l -8 8 l 8 8"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

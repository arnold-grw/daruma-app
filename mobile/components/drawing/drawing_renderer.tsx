import { eyeColor } from '@/constants/daruma_colors';
import { DrawingData } from '@/types/drawing';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface DrawingRendererProps {
  drawingData: DrawingData;
  width?: number;
  height?: number;
  centered?: boolean; // If true, the drawing will be centered within the given width/height
}

// ViewBox size for normalization
export const VIEWBOX_SIZE = 1000;

// Stroke width in viewBox units (also used for the eyes on the 3D daruma)
const MIN_STROKE_WIDTH = 50;
const MAX_STROKE_WIDTH = 500;
export const getStrokeWidth = (lineWidth: number = 0.5) => MIN_STROKE_WIDTH + lineWidth * (MAX_STROKE_WIDTH - MIN_STROKE_WIDTH);

export function DrawingRenderer({ drawingData, width = 100, height = 100, centered = false}: DrawingRendererProps) {

  // Function to transform normalized coords (-1 to 1) to SVG coords (0 to 1000)
  const transformCoord = (coord: number) => (coord + 1) * (VIEWBOX_SIZE / 2);

  // Function to build Path 'd' string for a line
  const buildPath = (line: any) => {
    if (!line.points || line.points.length === 0) return '';
    const commands = line.points.map((point: any, index: number) => {
      const x = transformCoord(point.x);
      const y = transformCoord(-point.y); // Flip Y since SVG Y increases downward, but our coords have -1 at bottom
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });
    return commands.join(' ');
  };

  return (
    <View style={{ 
      width, 
      height, 
      transform: centered ? [
        { translateX: -width/2  }, // Centers horizontally (half of width)
        { translateY: -height/2 }, // Centers vertically (half of height)
      ] : []
    }}>
      <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
        {drawingData.lines.map((line, index) => (
          <Path
            key={index}
            d={buildPath(line)}
            fill="none"
            stroke={eyeColor}
            strokeWidth={getStrokeWidth(line.width).toString()}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}
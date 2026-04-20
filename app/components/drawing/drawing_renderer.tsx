import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingData } from '@/types/drawing';
import { eyeColor } from '@/constants/daruma_colors';

interface DrawingRendererProps {
  drawingData: DrawingData;
  width?: number;
  height?: number;
  centered?: boolean; // If true, the drawing will be centered within the given width/height
}

export function DrawingRenderer({ drawingData, width = 100, height = 100, centered = false}: DrawingRendererProps) {
  // ViewBox size for normalization
  const VIEWBOX_SIZE = 1000;

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

  // Stroke width scale
  var minWidth = 50;
  var maxWidth = 500;
  const getStrokeWidth = (lineWidth: number = 0.5) => (minWidth + lineWidth * (maxWidth - minWidth)).toString();

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
            strokeWidth={getStrokeWidth(line.width)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}
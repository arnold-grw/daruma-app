import { DarumaDetails } from '@/components/daruma/daruma_details';
import { getDarumaColor } from '@/constants/daruma_colors';
import { Daruma } from '@/types/daruma';
import { View } from 'react-native';
import { DrawingRenderer } from '../drawing/drawing_renderer';

// where the eyes sit, as share of the daruma size (also used for the eyes on the 3D daruma):
// size of the square eye area (of the width), distance of each eye from the middle (of the width),
// and how far above the middle the eyes are (of the height)
export const EYE_LAYOUT = { size: 0.22, xOffset: 0.167, yOffset: 0.192 };

interface DarumaDisplayProps {
  daruma: Daruma;
  width?: number;
  height?: number;
}

export function DarumaDisplay({ daruma, width = 315, height = 324}: DarumaDisplayProps) {
  const { hex } = getDarumaColor(daruma.color);
  const eyeSize = width*EYE_LAYOUT.size;
  const eyeXOffset = width*EYE_LAYOUT.xOffset;
  const eyeYOffset = -height*EYE_LAYOUT.yOffset;
  
  return (
    <View style={{ width, height}}>
      <DarumaDetails color={daruma.color} width={width} height={height}/>
      {daruma.leftEyeDrawing && (
        <View style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: [
            { translateX: eyeXOffset },  // Offset X (adjust as needed)
            { translateY: eyeYOffset }  // Offset Y (adjust as needed)
          ]
        }}>
          <DrawingRenderer 
            drawingData={daruma.leftEyeDrawing} 
            width={eyeSize} 
            height={eyeSize}
            centered={true}
          />
        </View>
      )}
      {daruma.rightEyeDrawing && (
        <View style={{ 
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: [
            { translateX: -eyeXOffset },
            { translateY: eyeYOffset }
          ]
        }}>
          <DrawingRenderer 
            drawingData={daruma.rightEyeDrawing} 
            width={eyeSize} 
            height={eyeSize}
            centered={true}
          />
        </View>
      )}
    </View>
  );
}
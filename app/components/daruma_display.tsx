import { View } from 'react-native';
import { Image } from 'expo-image';
import { getDarumaColor } from '@/constants/daruma_colors';
import { Daruma } from '@/types/daruma';
import { DarumaDetails } from './daruma_details';
import { DrawingRenderer } from './drawing/drawing_renderer';

interface DarumaDisplayProps {
  daruma: Daruma;
  width?: number;
  height?: number;
}

export function DarumaDisplay({ daruma, width = 315, height = 324 }: DarumaDisplayProps) {
  const { hex } = getDarumaColor(daruma.color);
  var eyeSize = width*0.22;
  var eyeXOffset = width*0.167;
  var eyeYOffset = -height*0.192;
  
  return (
    <View style={{ width, height }}>
      <DarumaDetails color={daruma.color} width={width} height={height} />
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
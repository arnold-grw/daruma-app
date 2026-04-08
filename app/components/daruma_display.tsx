import { View } from 'react-native';
import { Image } from 'expo-image';
import { getDarumaColor } from '@/constants/daruma_colors';
import { DarumaColor } from '@/types/daruma';
import { DarumaBody } from './daruma_body';

interface DarumaDisplayProps {
  color: DarumaColor;
  width?: number;
  height?: number;
}

export function DarumaDisplay({ color, width = 315, height = 324 }: DarumaDisplayProps) {
  const { hex } = getDarumaColor(color);

  return (
    <View style={{ width, height }}>
      <DarumaBody color={hex} width={width} height={height} />
      <Image
        source={require('@/assets/daruma/details.svg')}
        style={{ width, height, position: 'absolute' }}
      />
    </View>
  );
}
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Pressable, Text } from 'react-native';

const PIVOT_OFFSET = 140;
const MAX_VELOCITY = 500;

export function WiggleDaruma({ children }: { children: React.ReactNode }) {
  const rotation = useSharedValue(0);   // degrees
  const velocity = useSharedValue(0);   // degrees per second

  // Physics loop — runs every frame
  useFrameCallback((frame) => {
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000; // seconds

    const stiffness = 100;  // spring force pulling back to 0
    const damping = 5;     // friction slowing it down

    const force = -stiffness * rotation.value - damping * velocity.value;
    velocity.value += force * dt;
    rotation.value += velocity.value * dt;

    velocity.value = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity.value));
    // Stop when essentially at rest
    if (Math.abs(velocity.value) < 1.0 && Math.abs(rotation.value) < 0.2) {
      velocity.value = 0;
      rotation.value = 0;
    }
  });

  const handlePress = () => {
    const impulse = 150;
    // kick opposite to current velocity so it always adds energy
    velocity.value += velocity.value >= 0 ? impulse : -impulse;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: PIVOT_OFFSET },
      { rotate: `${rotation.value}deg` },
      { translateY: -PIVOT_OFFSET },
    ],
  }));

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { forwardRef, useImperativeHandle } from 'react';

const PIVOT_OFFSET = 140;
const MAX_VELOCITY = 500;

export const WiggleDaruma = forwardRef(({ children }: { children: React.ReactNode }, ref) => {
  const rotation = useSharedValue(0);
  const velocity = useSharedValue(0);

  useFrameCallback((frame) => {
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000;
    const stiffness = 100;
    const damping = 5;
    const force = -stiffness * rotation.value - damping * velocity.value;
    velocity.value += force * dt;
    rotation.value += velocity.value * dt;
    velocity.value = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity.value));
    if (Math.abs(velocity.value) < 1.0 && Math.abs(rotation.value) < 0.2) {
      velocity.value = 0;
      rotation.value = 0;
    }
  });

  const applyImpulse = (impulse: number) => {
    velocity.value += velocity.value >= 0 ? impulse : -impulse;
  };

  useImperativeHandle(ref, () => ({ applyImpulse }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: PIVOT_OFFSET },
      { rotate: `${rotation.value}deg` },
      { translateY: -PIVOT_OFFSET },
    ],
  }));

  return (
    <Pressable onPress={() => applyImpulse(150)}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </Pressable>
  );
});
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { forwardRef, useImperativeHandle } from 'react';

const PIVOT_OFFSET = 140;
const MAX_VELOCITY = 500;

interface WiggleDarumaProps {
  children: React.ReactNode;
  // false: tapping does not wiggle (e.g. inside a card, where a tap opens the daruma)
  pressable?: boolean;
}

export const WiggleDaruma = forwardRef(({ children, pressable = true }: WiggleDarumaProps, ref) => {
  const rotation = useSharedValue(0);
  const velocity = useSharedValue(0);

  useFrameCallback((frame) => {
    // nothing to do while the daruma stands still
    if (velocity.get() === 0 && rotation.get() === 0) return;
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000;
    const stiffness = 100;
    const damping = 5;
    const force = -stiffness * rotation.get() - damping * velocity.get();
    const newVelocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity.get() + force * dt));
    const newRotation = rotation.get() + newVelocity * dt;
    if (Math.abs(newVelocity) < 1.0 && Math.abs(newRotation) < 0.2) {
      velocity.set(0);
      rotation.set(0);
    } else {
      velocity.set(newVelocity);
      rotation.set(newRotation);
    }
  });

  // a positive impulse tilts the top to the right first
  const applyImpulse = (impulse: number) => {
    velocity.set(velocity.get() + (velocity.get() >= 0 ? impulse : -impulse));
  };

  useImperativeHandle(ref, () => ({ applyImpulse }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: PIVOT_OFFSET },
      { rotate: `${rotation.get()}deg` },
      { translateY: -PIVOT_OFFSET },
    ],
  }));

  const content = <Animated.View style={animatedStyle}>{children}</Animated.View>;
  if (!pressable) return content;

  return (
    <Pressable onPress={() => applyImpulse(150)}>
      {content}
    </Pressable>
  );
});
WiggleDaruma.displayName = 'WiggleDaruma';

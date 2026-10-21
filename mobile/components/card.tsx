import { Text } from '@/components/typography';
import { ANIMATION_DURATION, timing } from "@/constants/animations";
import useTheme, { shadowStyle } from "@/constants/theme";
import { Daruma } from "@/types/daruma";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { DarumaDisplay } from "./daruma/daruma_display";
import { WiggleDaruma } from "./daruma/daruma_wiggle";
import { getDaysUntilDeadline } from "@/utils/date_formatter";
import { useTranslation } from "react-i18next";

// how strong the daruma wiggles while the new card slides in
const NEW_CARD_WIGGLE_IMPULSE = -250;

interface CardProps {
  daruma: Daruma;
  grayscale?: boolean;
  // true once for a daruma that was just created: the card slides in from the left while the daruma wiggles
  animateIn?: boolean;
}

export default function Card({ daruma, grayscale = false, animateIn = false }: CardProps) {
  const { colors, shadows } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const slideX = useSharedValue(0);
  const wiggleRef = useRef<{ applyImpulse: (impulse: number) => void }>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!animateIn) return;
    // jump outside the screen on the left, then slide back to the normal place
    slideX.set(-screenWidth);
    slideX.set(withDelay(ANIMATION_DURATION.newCardDelay, withTiming(0, timing(ANIMATION_DURATION.newCardSlide))));
    // the daruma starts wiggling together with the slide
    // (no clearTimeout on cleanup: animateIn turns false right away when home removes the id)
    setTimeout(() => wiggleRef.current?.applyImpulse(NEW_CARD_WIGGLE_IMPULSE), ANIMATION_DURATION.newCardDelay);
  }, [animateIn, slideX, screenWidth]);

  const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: slideX.get() }] }));

  const handlePress = () => {
    router.push({
      pathname: '/daruma/view',
      params: { darumaId: daruma.id }
    });
  };

  return (
    <Animated.View style={slideStyle}>
      <Pressable
        key={daruma.id}
        onPress={handlePress}
        style={{ width: 300, marginBottom: 30, backgroundColor: colors.card, padding: 20, borderRadius: 40, alignItems: "center",
          ...shadowStyle(shadows) }}
      >
        {grayscale ? (
          <View style={{ filter: 'grayscale(1)' }}>
            <DarumaDisplay daruma={daruma} width={252} height={260} />
          </View>
        ) : (
          <WiggleDaruma ref={wiggleRef} pressable={false}>
            <DarumaDisplay daruma={daruma} width={252} height={260}/>
          </WiggleDaruma>
        )}
        <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text, marginTop: 10, maxWidth: 315 }}>{daruma.goal}</Text>

        {daruma.deadline != null && !daruma.isFailed && !daruma.isCompleted && (
          <View style={{ alignItems: 'center', gap: 4 }}>
            {(() => {
              const daysRemaining = getDaysUntilDeadline(daruma.deadline);
              return (
                <Text style={{ color: colors.textSecondary, fontSize: 18 }}>
                  {daysRemaining === 0 ? t("view.last_day") : t("view.days_remaining", { count: daysRemaining })}
                </Text>
              );
            })()}
          </View>
        )}

      </Pressable>
    </Animated.View>
  );
}

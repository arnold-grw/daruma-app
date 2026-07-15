
import Card from '@/components/card';
import { Text } from '@/components/typography';
import useTheme from '@/constants/theme';
import { updateFailedDarumas, useActiveDarumas, useCompletedDarumas, useDarumaStore, useFailedDarumas } from '@/store/daruma_store';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, View } from "react-native";
import { default as ConfettiCannon, default as Explosion } from 'react-native-confetti-cannon';

// Define a type for the ConfettiCannon ref
type ConfettiCannonRef = {
  start: () => void;
};
  
export default function Archive() {
  const { load } = useDarumaStore()
  const activeDarumas = useActiveDarumas()
  const completedDarumas = useCompletedDarumas()
  const failedDarumas = useFailedDarumas()
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const confettiRef = useRef<Explosion>(null);

  // Load darumas when the component mounts
  useEffect(() => {
    updateFailedDarumas();
    load();
  }, []);

  // Trigger confetti if the celebrate flag is set
  useEffect(() => {
    if (params.celebrate === 'true' && confettiRef.current) {
      confettiRef.current.start();
    }
  }, [params.celebrate]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >
        {/* <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text }}>Shrine</Text> */}
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>

        {/* overdue darumas */}
        {failedDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — overdue —
          </Text>
        )}
        {failedDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} grayscale={true} />
        ))}

        {/* completed darumas */}
        {completedDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — completed —
          </Text>
        )}
        {completedDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} />
        ))}

        </ScrollView>
        <View style={{}}>
          <ConfettiCannon
            count={100}
            origin={{x: screen.availWidth/2, y: -20}}
            autoStart={false}
            fadeOut={true}
            colors={['#deb2d2']}
            ref={confettiRef}
          />
        </View>
    </View>
  );
}

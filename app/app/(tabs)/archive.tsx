
import Card from '@/components/card';
import EmptyState from '@/components/empty_state';
import { Text } from '@/components/typography';
import useTheme from '@/constants/theme';
import { useCompletedDarumas, useDarumaStore } from '@/store/daruma_store';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ScrollView, useWindowDimensions, View } from "react-native";
import { default as ConfettiCannon, default as Explosion } from 'react-native-confetti-cannon';
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

// Define a type for the ConfettiCannon ref
type ConfettiCannonRef = {
  start: () => void;
};
  
export default function Archive() {
  const load = useDarumaStore(state => state.load)
  const completedDarumas = useCompletedDarumas()
  const { colors } = useTheme();
  // set by the finish screen: the card of this daruma slides in and the confetti fires
  const { completedDarumaId } = useLocalSearchParams<{ completedDarumaId?: string }>();
  const navigation = useNavigation<{ setParams: (params: { completedDarumaId?: string }) => void }>();
  const { width } = useWindowDimensions();
  const confettiRef = useRef<Explosion>(null);

    const language = useLanguageStore((s) => s.language);
    const setLanguage = useLanguageStore((s) => s.setLanguage);
    const { t } = useTranslation();

  // Load darumas when the component mounts
  useEffect(() => {
    load();
  }, []);

  // Trigger confetti when a daruma was just completed
  useEffect(() => {
    if (completedDarumaId) {
      confettiRef.current?.start();
      // clear the id so the confetti and the card animation only play once per completion
      // (navigation.setParams changes this screen's params; router.setParams would change the focused screen)
      navigation.setParams({ completedDarumaId: undefined });
    }
  }, [completedDarumaId, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >

        {completedDarumas.length === 0 ? (
          <EmptyState title={t("archive.empty.title")} text={t("archive.empty.text")} />
        ) : (
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>

        {/* completed darumas */}
        {completedDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — {t("archive.completed")} —
          </Text>
        )}
        {completedDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} animateIn={daruma.id === completedDarumaId} />
        ))}

        </ScrollView>
        )}
        <View style={{}}>
          <ConfettiCannon
            count={100}
            origin={{x: width / 2, y: -20}}
            autoStart={false}
            fadeOut={true}
            colors={['#deb2d2']}
            ref={confettiRef}
          />
        </View>
    </View>
  );
}

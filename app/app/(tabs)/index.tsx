
import Card from '@/components/card';
import EmptyState from '@/components/empty_state';
import useTheme from '@/constants/theme';
import { useActiveDarumas, useOverdueDarumas, useDarumaStore } from '@/store/daruma_store';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text } from '@/components/typography';
  
export default function Index() {
  const load = useDarumaStore(state => state.load)
  const activeDarumas = useActiveDarumas()
  const overdueDarumas = useOverdueDarumas()
  const { colors } = useTheme();
  const { t } = useTranslation();
  // set by the new daruma flow, so the card of the new daruma can animate in
  const { newDarumaId } = useLocalSearchParams<{ newDarumaId?: string }>();
  const navigation = useNavigation<{ setParams: (params: { newDarumaId?: string }) => void }>();

  // Load darumas when the component mounts
  useEffect(() => {
    load();
  }, []);

  // the card already started its animation, remove the id so it does not play again
  // (navigation.setParams changes this screen's params; router.setParams would change the focused screen,
  // which can still be the new daruma screen at this moment)
  useEffect(() => {
    if (newDarumaId) navigation.setParams({ newDarumaId: undefined });
  }, [newDarumaId, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >
        {(activeDarumas.length === 0 && overdueDarumas.length === 0) ? (
          <EmptyState title={t("home.empty.title")} text={t("home.empty.text")} />
        ) : (
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>
        
        {/* active darumas */}
        {activeDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — {t("home.your_darumas")} —
          </Text>
        )}
        {activeDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} animateIn={daruma.id === newDarumaId} />
        ))}

        {/* overdue darumas */}
        {overdueDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — {t("archive.overdue")} —
          </Text>
        )}
        {overdueDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} grayscale={true} />
        ))}

        </ScrollView>
        )}
    </View>
  );
}

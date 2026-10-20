
import Card from '@/components/card';
import EmptyState from '@/components/empty_state';
import useTheme from '@/constants/theme';
import { useActiveDarumas, useDarumaStore } from '@/store/daruma_store';
import { useEffect } from 'react';
import { ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
  
export default function Index() {
  const load = useDarumaStore(state => state.load)
  const activeDarumas = useActiveDarumas()
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Load darumas when the component mounts
  useEffect(() => {
    load();
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >
        {/* <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text }}>Shrine</Text> */}
        {activeDarumas.length === 0 ? (
          <EmptyState title={t("home.empty.title")} text={t("home.empty.text")} />
        ) : (
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>
        
        {activeDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} />
        ))}

        </ScrollView>
        )}
    </View>
  );
}

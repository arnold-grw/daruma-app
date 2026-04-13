
import { router, useRouter } from 'expo-router'
import { View, ScrollView, Pressable, Image } from "react-native";
import { Text } from '@/components/typography';
import { useDarumaStore, useActiveDarumas, useCompletedDarumas } from '@/store/daruma_store';
import { useEffect } from 'react';
import { Daruma } from '@/types/daruma';
import { getDarumaColor } from '@/constants/daruma_colors';
import useTheme from '@/constants/theme';
import { DarumaDisplay } from '@/components/daruma_display'
import Card from '@/components/card'
  
export default function Index() {
  const { load } = useDarumaStore()
  const activeDarumas = useActiveDarumas()
  const completedDarumas = useCompletedDarumas()
  const { colors } = useTheme();

  // Load darumas when the component mounts
  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >
        {/* <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text }}>Shrine</Text> */}
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>

        {activeDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} />
        ))}

        {completedDarumas.length > 0 && (
          <Text style={{ color: colors.textSecondary, fontSize: 24, marginVertical: 16 }}>
            — completed —
          </Text>
        )}

        {completedDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} />
        ))}

        </ScrollView>
    </View>
  );
}

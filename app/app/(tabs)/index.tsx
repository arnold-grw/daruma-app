
import Card from '@/components/card';
import useTheme from '@/constants/theme';
import { updateFailedDarumas, useActiveDarumas, useCompletedDarumas, useDarumaStore } from '@/store/daruma_store';
import { useEffect } from 'react';
import { ScrollView, View } from "react-native";
  
export default function Index() {
  const { load } = useDarumaStore()
  const activeDarumas = useActiveDarumas()
  const completedDarumas = useCompletedDarumas()
  const { colors } = useTheme();

  // Load darumas when the component mounts
  useEffect(() => {
    updateFailedDarumas();
    load();
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} >
        {/* <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text }}>Shrine</Text> */}
        <ScrollView style={{paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>

        {activeDarumas.map(daruma => (
          <Card key={daruma.id} daruma={daruma} />
        ))}

        </ScrollView>
    </View>
  );
}

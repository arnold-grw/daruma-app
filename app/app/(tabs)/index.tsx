
import Card from '@/components/card';
import useTheme from '@/constants/theme';
import { useActiveDarumas, useDarumaStore } from '@/store/daruma_store';
import { useEffect } from 'react';
import { ScrollView, View } from "react-native";
  
export default function Index() {
  const load = useDarumaStore(state => state.load)
  const activeDarumas = useActiveDarumas()
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

        </ScrollView>
    </View>
  );
}

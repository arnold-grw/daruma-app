
import { router } from 'expo-router'
import { Text, View, ScrollView, Pressable, Image } from "react-native";
import { useDarumaStore } from '@/store/daruma_store';
import { useEffect } from 'react';

export default function Index() {
  const { darumas, load } = useDarumaStore();
  
  // Load darumas when the component mounts
  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ paddingTop: 50, flex: 1 }} >
        <Text style={{ textAlign: 'center', fontSize: 24 }}>Shrine</Text>
        <ScrollView style={{ marginTop: 20, paddingHorizontal: 20, flex: 1 }} contentContainerStyle={{ alignItems: "center" }}>
          <Pressable onPress={() => router.push('/daruma/view')} style={{ marginBottom: 50, backgroundColor: 'lightgray', padding: 10, borderRadius: 40 }}>
            <Image source={{ uri: "https://static.vecteezy.com/system/resources/previews/019/046/456/original/daruma-doll-symbol-png.png" }} style={{ width: 315, height: 350 }} />
            <Text style={{ textAlign: 'center', fontSize: 24, marginTop: 10 }}>read book</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/daruma/view')} style={{ marginBottom: 50, backgroundColor: 'lightgray', padding: 10, borderRadius: 40 }}>
            <Image source={{ uri: "https://static.vecteezy.com/system/resources/previews/019/046/456/original/daruma-doll-symbol-png.png" }} style={{ width: 315, height: 350 }} />
            <Text style={{ textAlign: 'center', fontSize: 24, marginTop: 10 }}>pass exam</Text>
          </Pressable>

          {darumas.map(daruma => (
          <Pressable
            key={daruma.id}
            //onPress={}
            style={{ marginBottom: 30, backgroundColor: 'lightgray', padding: 10, borderRadius: 40 }}
          >
            <Text style={{ textAlign: 'center', fontSize: 24 }}>{daruma.goal}</Text>
            <Text style={{ textAlign: 'center', color: '#666' }}>{daruma.color}</Text>
          </Pressable>
        ))}

        </ScrollView>
    </View>
  );
}

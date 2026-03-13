import { router } from "expo-router";
import { Text, View, ScrollView, Pressable } from "react-native";

export default function ViewDaruma() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'white', flex: 1 }}>
        {/* header */}
        <View>
          <Pressable onPress={() => router.back()}>
            <Text>←</Text>
          </Pressable>
        </View>

        <Text style={{ color: 'black', fontSize: 24 }}>view Daruma</Text>

    </View>
  );
}
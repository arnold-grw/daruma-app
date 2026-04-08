import { View, ScrollView } from "react-native";
import { Text } from '@/components/typography';

export default function Profile() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'white', flex: 1 }}>
        <Text style={{ color: 'black', fontSize: 24 }}>Profile</Text>
    </View>
  );
}
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, ScrollView, Pressable } from "react-native";
import { Daruma } from "@/types/daruma";
import { getDarumaColor } from "@/constants/daruma_colors";
import { useDarumaStore } from "@/store/daruma_store";
import useTheme from "@/constants/theme";


export default function ViewDaruma() {

const { darumaId } = useLocalSearchParams();
//const { darumaId } = route.params;
const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));
const goal = daruma ? daruma.goal : "Daruma not found";
const darumaColor = daruma ? getDarumaColor(daruma.color).hex : "#000";
const createdAt = daruma ? daruma.createdAt : "N/A";
const isCompleted = daruma ? daruma.isCompleted : false;

const { colors } = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: colors.background, flex: 1 }}>
        {/* header */}
        <View>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.text }}>←</Text>
          </Pressable>
        </View>

        <Text style={{ color: colors.text, fontSize: 24 }}>{goal}</Text>
        <Text style={{ color: darumaColor, fontSize: 18 }}>{ daruma ? daruma.color : "N/A"}</Text>
        <Text style={{ color: 'gray', fontSize: 18 }}>{createdAt}</Text>
        <Text style={{ color: colors.text}}>{isCompleted ? "Completed" : "In Progress"}</Text>

        {!isCompleted && (
          <Pressable
            // go to complete screen
            style={{ marginBottom: 30, backgroundColor: 'lightgray', padding: 10, borderRadius: 40 }}>
            <Text>Complete</Text>
          </Pressable>
        )}

    </View>
  );
}

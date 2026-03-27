import { useState, useEffect } from "react";
import { Text, View, ScrollView, Pressable, FlatList, Dimensions, TextInput } from "react-native";
import { router } from "expo-router";
import useTheme from "@/constants/theme";
import ColorPicker from "@/components/color_picker";
import BottomActionBar from "@/components/bottom_action_bar";
import { DARUMA_COLORS, getDarumaColor } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";
import { useDarumaStore } from "@/store/daruma_store";

export default function NewDaruma() {

  const { width } = Dimensions.get("window");
  const { colors } = useTheme();

  const { draft, setDraft, commitDraft } = useDarumaStore()
  const colorConfig = getDarumaColor(draft.color)

  useEffect(() => {
    setDraft({ color: 'red', goal: '', notes: '' })
  }, [])

  const handleConfirm = async () => {
    if (!draft.goal.trim()) {
      console.log("empty goal")
      return;
    }
    await commitDraft();
    router.back();

    //  TODO:
    // router.push('/daruma/draw')
  }


  return (
    <View style={{ justifyContent: "space-between", alignItems: "center", backgroundColor: colors.background, flex: 1}}>
      <View style={{ alignItems: "center", gap: 10 }}>

        <Text style={{ color: colors.text, fontSize: 24 }}>new Daruma</Text>

        <ColorPicker
          selected={draft.color}
          onSelect={(color: DarumaColor) => setDraft({ color })}
      />

      <View style={{ alignItems: "center", gap: 4, paddingBottom: 30 }}>
        <Text style={{ color: colorConfig.hex ,fontSize: 18, fontWeight: "600" }}>
          {colorConfig.label}
        </Text>

        <Text style={{ color: "gray" }}>
          {colorConfig.meaning}
        </Text>
      </View>

      <TextInput
        placeholder="Your goal"
        value={draft.goal}
        onChangeText={(goal) => setDraft({ goal })}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          width: 250,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="notes"
        value={draft.notes}
        onChangeText={(notes) => setDraft({ notes })}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          width: 250,
          borderRadius: 8,
        }}
      />

      
       </View>
       <BottomActionBar
        onConfirm={() => {
          handleConfirm()
        }}
      />
    </View>
  );
}
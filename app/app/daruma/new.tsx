import { useState, useEffect } from "react";
import { View, ScrollView, Pressable, FlatList, Dimensions, KeyboardAvoidingView } from "react-native";
import { Text, TextInput } from '@/components/typography';
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

  const { draft, setDraft, commitDraft, resetDraft } = useDarumaStore()
  const colorConfig = getDarumaColor(draft.color)

  useEffect(() => {
    if (!draft.color) {
      setDraft({ color: 'red', goal: '', notes: '' });
    }
  }, [])

  useEffect(() => {
    return () => {
      resetDraft();
    };
  }, [])

  const handleConfirm = async () => {
    if (!draft.goal.trim()) {
      console.log("empty goal")
      return;
    }
    router.push({
      pathname: '/daruma/paint_start'
    });
  }

  const canConfirm = draft.goal.trim().length > 0;

  const handleReturn = async () => {
    resetDraft();
    router.push({
      pathname: '/'
    });
  }

  return (
    <View style={{ justifyContent: "space-between", alignItems: "center", backgroundColor: colors.background, flex: 1}}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior="position"
        keyboardVerticalOffset={-40}
        >
          <ScrollView>
            <View style={{ alignItems: "center", gap: 10 }}>

              <Text style={{ color: colors.text, fontSize: 24, marginTop: 40 }}>new Daruma</Text>

              <ColorPicker
                selected={draft.color}
                onSelect={(color: DarumaColor) => setDraft({ color })}
              />

              <View style={{ alignItems: "center", gap: 4, paddingBottom: 30, marginTop: -30 }}>
                <Text style={{ color: colorConfig.hex ,fontSize: 18, fontWeight: "600" }}>
                  {colorConfig.label}
                </Text>

                <Text style={{ color: colors.textSecondary }}>
                  {colorConfig.meaning}
                </Text>
              </View>

              <TextInput
                placeholder="describe your goal in a short sentence"
                placeholderTextColor={colors.textSecondary}
                value={draft.goal}
                onChangeText={(goal) => setDraft({ goal })}
                maxLength={40}
                style={{
                  borderWidth: 2,
                  borderColor: colors.textSecondary,
                  padding: 10,
                  width: 300,
                  borderRadius: 8,
                }}
              />

              <TextInput
                placeholder="notes (optional)"
                placeholderTextColor={colors.textSecondary}
                value={draft.notes}
                onChangeText={(notes) => setDraft({ notes})}
                multiline={true}
                style={{
                  borderWidth: 2,
                  borderColor: colors.textSecondary,
                  padding: 10,
                  width: 300,
                  borderRadius: 8,
                  height: 120,
                  textAlignVertical: 'top',
                }}
              />

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      <BottomActionBar
        onCancel={() => {
          handleReturn();
        }}
        onConfirm={() => {
          handleConfirm();
        }}
        canConfirm={canConfirm}
      />
    </View>
  );
}
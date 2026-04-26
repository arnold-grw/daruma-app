// components/new_daruma/StepGoal.tsx
import { useEffect } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/typography";
import { StepProps } from "@/app/daruma/new";
import useTheme from "@/constants/theme";

export function StepGoal({ draft, setDraft, onValidChange }: StepProps) {
  useEffect(() => {
    onValidChange(draft.goal.trim().length > 0);
  }, [draft.goal]);

  const colors = useTheme().colors;

  return (
    <View style={{justifyContent: "space-between", alignItems: "center", backgroundColor: colors.background, flex: 1}}>
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior="position"
            keyboardVerticalOffset={-40}
            >
            <ScrollView style={{ }}>
                <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 20}}>Put your goal into words</Text>
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
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
}
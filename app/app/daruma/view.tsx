import BottomActionBar from "@/components/bottom_action_bar";
import { DarumaDisplay } from "@/components/daruma/daruma_display";
import { WiggleDaruma } from "@/components/daruma/daruma_wiggle";
import { BaseModal } from "@/components/modals/BaseModal";
import { DarumaInfoContent } from "@/components/modals/DarumaInfoContent";
import { Text, TextInput } from '@/components/typography';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { safeBack } from "@/utils/navigation";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";

export default function ViewDaruma() {

  const { darumaId } = useLocalSearchParams();
  const { updateNotes, delete: deleteDaruma } = useDarumaStore()
  const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

  const { colors } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState(daruma?.notes ?? "")

  const localNotesRef = useRef(daruma?.notes ?? "")
  const handleNotesChange = (text: string) => {
    setLocalNotes(text)
    localNotesRef.current = text
  }
  //for wiggle animation when opening page
  const wiggleRef = useRef<{ applyImpulse: (impulse: number) => void }>(null);

  useEffect(() => {
    return () => { updateNotes(darumaId as string, localNotesRef.current) }
  }, [])

  useEffect(() => {
    setTimeout(() => wiggleRef.current?.applyImpulse(50), 0); // slight delay feels more natural
  }, []);

  const handleComplete = async () => {
    if (!daruma || !darumaId) return;
    router.push({ pathname: '/daruma/paint_finish', params: { darumaId: daruma.id } });
  }

  const handleDelete = async () => {
    var wasCompleted = daruma?.isCompleted;
    if (!daruma || !darumaId) return;
    await deleteDaruma(darumaId as string);
    setSheetOpen(false);
    safeBack();
  }

  if (!daruma) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text>Daruma not found</Text>
    </View>
  )

  return (
    <View style={{ justifyContent: "space-between", alignItems: "center", backgroundColor: colors.background, flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="position" keyboardVerticalOffset={-140}>
        <ScrollView style={{overflow: 'visible'}}>
          <View style={{ alignItems: "center", gap: 30 }}>
            <Pressable
              onPress={() => setSheetOpen(true)}
              style={{ position: 'absolute', top: 50, right: 20 }}
            >
              <Text style={{ fontSize: 32, color: colors.text }}>⋯</Text>
            </Pressable>

            <Text style={{ color: colors.text, fontSize: 24, marginTop: 50, textAlign: "center", maxWidth: 300, paddingHorizontal: 30 }}>
              {daruma.goal}
            </Text>

            <WiggleDaruma ref={wiggleRef}>
              <DarumaDisplay daruma={daruma} width={315 * 1.1} height={324 * 1.1} />
            </WiggleDaruma>

            <TextInput
              placeholder="notes"
              placeholderTextColor={colors.textSecondary}
              value={localNotes}
              onChangeText={handleNotesChange}
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

      <BaseModal visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <DarumaInfoContent
          daruma={daruma}
          onConfirmDelete={handleDelete}
          onClose={() => setSheetOpen(false)}
        />
      </BaseModal>

      {!daruma.isCompleted && (
        <BottomActionBar onConfirm={handleComplete} confirmLabel="Complete" cancelLabel="Return" />
      )}
      {daruma.isCompleted && (
        <BottomActionBar showConfirm={false} cancelLabel="Return" onConfirm={() => {}} />
      )}
    </View>
  );
}
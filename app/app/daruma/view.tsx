import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView, Pressable, Modal, KeyboardAvoidingView } from "react-native";
import { Text, TextInput } from '@/components/typography';
import { Daruma } from "@/types/daruma";
import { getDarumaColor } from "@/constants/daruma_colors";
import { useDarumaStore } from "@/store/daruma_store";
import useTheme from "@/constants/theme";
import BottomActionBar from "@/components/bottom_action_bar";
import { use, useState, useEffect, useRef } from "react";
import { DarumaDisplay } from "@/components/daruma_display";
import { formatDate, DEFAULT_DATE_FORMAT } from "@/utils/date_formatter";


export default function ViewDaruma() {

  const { darumaId } = useLocalSearchParams();
  const { updateNotes, delete: deleteDaruma } = useDarumaStore()
  const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

  const { colors } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [localNotes, setLocalNotes] = useState(daruma?.notes ?? "")

  const localNotesRef = useRef(daruma?.notes ?? "")
  const handleNotesChange = (text: string) => {
    setLocalNotes(text)
    localNotesRef.current = text    // keep a ref to the latest notes for saving on unmount
  }

  useEffect(() => {
    return () => { updateNotes(darumaId as string, localNotesRef.current) }
  }, [])

  const handleComplete = async () => {
    if (!daruma || !darumaId) return;
    router.push({
      pathname: '/daruma/paint_finish',
      params: { darumaId: daruma.id }
    });
  }

  const handleDelete = async () => {
    if (!daruma || !darumaId) return;
    await deleteDaruma(darumaId as string);
    setSheetOpen(false)
    router.push('/');
  }

    if (!daruma) return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text>Daruma not found</Text>
      </View>
    )
    return (
      <View style={{ justifyContent: "space-between", alignItems: "center", backgroundColor: colors.background, flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="position"
          keyboardVerticalOffset={-140}
        >
          <ScrollView>
            <View style={{ alignItems: "center", gap: 30}}>
            {/* options button */}
            <Pressable
              onPress={() => { setSheetOpen(true); setConfirmDelete(false) }}
              style={{ position: 'absolute', top: 55, right: 0}}
            >
              <Text style={{ fontSize: 24, color: colors.text }}>⋯</Text>
            </Pressable>

            <Text style={{ color: colors.text, fontSize: 24, marginTop: 50, textAlign: "center", maxWidth: 300, paddingHorizontal: 30 }}>{daruma.goal}</Text>
            
            <DarumaDisplay daruma={daruma} />

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

            {/* <Text style={{ color: colors.textSecondary, fontSize: 18 }}>{formatDate(daruma.createdAt, DEFAULT_DATE_FORMAT)}</Text> */}
            {/*<Text style={{ color: colors.text}}>{daruma.isCompleted ? "Completed" : "In Progress"}</Text>}*/}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        


        <Modal
          visible={sheetOpen}
          transparent
          animationType="none"
          onRequestClose={() => setSheetOpen(false)}
        >
          {/* dark overlay */}
          <Pressable
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
            onPress={() => setSheetOpen(false)}
          />
          {/* content */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            gap: 16,
          }}>
          <View style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            gap: 16,
          }}>

            {!confirmDelete ? (
              //─ Daruma Info ──
              <>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
                  Daruma Info
                </Text>
                <Text style={{ color: colors.textSecondary }}>Created: {formatDate(daruma.createdAt, DEFAULT_DATE_FORMAT)}</Text>
                <Text style={{ color: colors.textSecondary }}>Updated: {formatDate(daruma.updatedAt, DEFAULT_DATE_FORMAT)}</Text>

                <Pressable
                  onPress={() => setConfirmDelete(true)}
                  style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.danger }}
                >
                  <Text style={{ color: colors.danger, textAlign: 'center', fontWeight: '600' }}>
                    Delete Daruma
                  </Text>
                </Pressable>

                <Pressable onPress={() => setSheetOpen(false)}>
                  <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              // ── Confirmation ──
              <>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
                  Are you sure?
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  This cannot be undone.
                </Text>

                <Pressable
                  onPress={handleDelete}
                  style={{ padding: 14, borderRadius: 12, backgroundColor: colors.danger }}
                >
                  <Text style={{ color: colors.background, textAlign: 'center', fontWeight: '600' }}>
                    Yes, delete
                  </Text>
                </Pressable>

                <Pressable onPress={() => setConfirmDelete(false)}>
                  <Text style={{ textAlign: 'center', color: colors.textSecondary }}>Go back</Text>
                </Pressable>
              </>
            )}

          </View>
          </View>
        </Modal>

        {!daruma.isCompleted && (
          <BottomActionBar
            onConfirm={() => {
              handleComplete();
            }}
            confirmLabel="Complete"
            cancelLabel="Return"
          ></BottomActionBar>
        )}
        {daruma.isCompleted && (
          <BottomActionBar
            onConfirm={() => {
              
            }}
            showConfirm = {false}
            cancelLabel="Return"
          ></BottomActionBar>
        )}
      </View>
    );
}

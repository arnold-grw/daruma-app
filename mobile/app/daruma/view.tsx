import Daruma3D from "@/components/3d/daruma_model";
import BottomActionBar from "@/components/action_bar";
import ExtendDeadline from "@/components/extend_deadline";
import KeyboardShift from "@/components/keyboard_shift";
import { BottomModal } from "@/components/modals/bottom_modal";
import { DarumaInfoContent } from "@/components/modals/info_context";
import { Text, TextInput } from '@/components/typography';
import useTheme from "@/constants/theme";
import { useDarumaStore } from "@/store/daruma_store";
import { formatDate, getDaysUntilDeadline } from "@/utils/date_formatter";
import { localDateFormat } from "@/i18n/date_format";
import { safeBack } from "@/utils/navigation";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

// height of the 3D daruma: share of the screen width, and at most this many px
const DARUMA_SIZE_RATIO = 0.85;
const MAX_DARUMA_SIZE = 400;

export default function ViewDaruma() {

  const { darumaId } = useLocalSearchParams();
  const { updateNotes, updateGoal, delete: deleteDaruma, extendDeadline } = useDarumaStore()
  const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  // the daruma grows with the screen, but not beyond MAX_DARUMA_SIZE on wide devices
  const darumaSize = Math.min(windowWidth * DARUMA_SIZE_RATIO, MAX_DARUMA_SIZE);
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false)
  const [localNotes, setLocalNotes] = useState(daruma?.notes ?? "")

  const localNotesRef = useRef(daruma?.notes ?? "")
  const handleNotesChange = (text: string) => {
    setLocalNotes(text)
    localNotesRef.current = text
  }
  useEffect(() => {
    return () => { updateNotes(darumaId as string, localNotesRef.current) }
  }, [])

  const handleComplete = async () => {
    if (!daruma || !darumaId) return;
    router.push({ pathname: '/daruma/paint_finish', params: { darumaId: daruma.id } });
  }

  const handleDelete = async () => {
    if (!daruma || !darumaId) return;
    var wasCompleted = daruma?.isCompleted;
    await deleteDaruma(darumaId as string);
    setSheetOpen(false);
    safeBack();
  }

  const handleChangeGoal = async (newGoal: string) => {
    if (!daruma || !darumaId) return;
    await updateGoal(darumaId as string, newGoal);
    setSheetOpen(false);
  }

  const handleExtendDeadline = async (newDeadline: string) => {
    if (!daruma || !darumaId) return;
    await extendDeadline(darumaId as string, newDeadline);
  }

  if (!daruma) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text>{t("view.not_found")}</Text>
    </View>
  )

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {/* Everything except the action bar moves up with the keyboard; the sheet handles its own input */}
      <KeyboardShift style={{ flex: 1 }} enabled={!sheetOpen}>
        <ScrollView style={{overflow: 'visible'}}>
          <View style={{ alignItems: "center", gap: 30 }}>
            <Pressable
              onPress={() => setSheetOpen(true)}
              style={{ position: 'absolute', top: 42, right: 30 }}
            >
              <Text style={{ fontSize: 36, color: colors.text }}>⋯</Text>
            </Pressable>

            <Text style={{ color: colors.text, fontSize: 24, marginTop: 50, textAlign: "center", maxWidth: 300, paddingHorizontal: 30 }}>
              {daruma.goal}
            </Text>

            {/* 3D daruma with its painted eyes; drag sideways to turn it */}
            <Daruma3D
              color={daruma.color}
              leftEye={daruma.leftEyeDrawing}
              rightEye={daruma.rightEyeDrawing}
              size={darumaSize}
            />

            <TextInput
              placeholder={t("view.notes_placeholder")}
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
                height: 100,
                textAlignVertical: 'top',
              }}
            />

            {daruma.deadline != null && !daruma.isFailed && !daruma.isCompleted && (
              <View style={{ alignItems: 'center', gap: 4 }}>
                {(() => {
                  const daysRemaining = getDaysUntilDeadline(daruma.deadline);
                  return (
                    <Text style={{ color: colors.text, fontSize: 18 }}>
                      {daysRemaining === 0 ? t("view.last_day") : t("view.days_remaining", { count: daysRemaining })}
                    </Text>
                  );
                })()}
                <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
                  {t("view.deadline", { date: formatDate(daruma.deadline, localDateFormat(t)) })}
                </Text>
              </View>
            )}
            {daruma.isFailed && daruma.deadline && !daruma.isCompleted && (
              <ExtendDeadline deadline={daruma.deadline} onConfirm={handleExtendDeadline} />
            )}

          </View>
        </ScrollView>
      </KeyboardShift>

      <BottomModal visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <DarumaInfoContent
          daruma={daruma}
          onConfirmDelete={handleDelete}
          onChangeGoal={handleChangeGoal}
          onClose={() => setSheetOpen(false)}
        />
      </BottomModal>

      {!daruma.isCompleted && !daruma.isFailed && (
        <BottomActionBar onConfirm={handleComplete} confirmLabel={t("common.complete")} cancelLabel={t("common.return")} />
      )}
      {(daruma.isCompleted || daruma.isFailed) && (
        <BottomActionBar showConfirm={false} cancelLabel={t("common.return")} onConfirm={() => {}} />
      )}
    </View>
  );
}

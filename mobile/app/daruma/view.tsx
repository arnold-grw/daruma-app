import Daruma3D, { VIEW_HEIGHT_RATIO } from "@/components/3d/daruma_model";
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
import { NAVIGATION } from "@/constants/navigation";
import { BACK_ICON_SIZE, ChevronLeftIcon } from "@/components/icons/button_icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";

// height of the 3D daruma: share of the screen width, and at most this many px
const DARUMA_SIZE_RATIO = 0.85;
const MAX_DARUMA_SIZE = 400;
// top row with the back arrow (left) and the "⋯" (right): distance from the top and from the sides
const TOP_ROW_TOP = 42;
const TOP_ROW_SIDE = 30;
// the elements share the free height evenly; these are the smallest gap between them and the space above the title / below the last one
const MIN_GAP = 12;
const TITLE_TOP = 50;
const BOTTOM_SPACE = 20;
// on short screens the daruma shrinks so everything fits, but not below this size (then the page scrolls)
const MIN_DARUMA_SIZE = 140;

export default function ViewDaruma() {

  const { darumaId } = useLocalSearchParams();
  const { updateNotes, updateGoal, delete: deleteDaruma, extendDeadline } = useDarumaStore()
  const daruma = useDarumaStore(state => state.darumas.find(d => d.id === darumaId));

  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  // height of the scroll area and of every element except the daruma (measured), so the daruma can take the rest
  const [areaHeight, setAreaHeight] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const measure = (key: string) => (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    setHeights((h) => (h[key] === height ? h : { ...h, [key]: height }));
  };
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

  const showDeadline = daruma?.deadline != null && !daruma.isFailed && !daruma.isCompleted;
  const showExtend = !!daruma?.isFailed && !!daruma.deadline && !daruma.isCompleted;
  const shownKeys = ["title", "notes", ...(showDeadline ? ["deadline"] : []), ...(showExtend ? ["extend"] : [])];
  const othersHeight = shownKeys.reduce((sum, key) => sum + (heights[key] ?? 0), 0);
  // free height for the daruma: the area minus the other elements and the smallest gaps (one gap per element)
  const fitsHeight = areaHeight - TITLE_TOP - BOTTOM_SPACE - othersHeight - shownKeys.length * MIN_GAP;
  // the daruma grows with the screen width, but not beyond MAX_DARUMA_SIZE, and shrinks on short screens
  const fitsWidth = Math.min(windowWidth * DARUMA_SIZE_RATIO, MAX_DARUMA_SIZE);
  const darumaSize = areaHeight > 0 ? Math.max(MIN_DARUMA_SIZE, Math.min(fitsWidth, fitsHeight)) : fitsWidth;
  // the 3D view is higher than the daruma (room for wobbling); this empty band is not counted as space
  const darumaBand = darumaSize * (VIEW_HEIGHT_RATIO - 1) / 2;

  if (!daruma) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text>{t("view.not_found")}</Text>
    </View>
  )

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {/* Everything except the action bar moves up with the keyboard; the sheet handles its own input */}
      <KeyboardShift style={{ flex: 1 }} enabled={!sheetOpen}>
        <ScrollView style={{overflow: 'visible'}} contentContainerStyle={{ flexGrow: 1 }}
          onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}>
          {/* the elements are spread evenly over the height; the daruma takes what is left (see darumaSize) */}
          <View style={{ flexGrow: 1, alignItems: "center", justifyContent: "space-evenly", gap: MIN_GAP,
            paddingTop: TITLE_TOP, paddingBottom: BOTTOM_SPACE }}>
            {/* back arrow and "⋯" in one row, so both sit at the same height with the same distance to the side */}
            <View style={{ position: 'absolute', top: TOP_ROW_TOP, left: TOP_ROW_SIDE, right: TOP_ROW_SIDE, zIndex: 1,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              {NAVIGATION.backButtonTop ? (
                <Pressable onPress={() => safeBack()} hitSlop={12}>
                  <ChevronLeftIcon color={colors.text} size={BACK_ICON_SIZE} />
                </Pressable>
              ) : <View />}
              <Pressable onPress={() => setSheetOpen(true)}>
                <Text style={{ fontSize: 36, color: colors.text }}>⋯</Text>
              </Pressable>
            </View>

            <Text onLayout={measure("title")} style={{ color: colors.text, fontSize: 24, textAlign: "center", maxWidth: 300, paddingHorizontal: 30 }}>
              {daruma.goal}
            </Text>

            {/* 3D daruma with its painted eyes; drag sideways to turn it */}
            <Daruma3D
              color={daruma.color}
              leftEye={daruma.leftEyeDrawing}
              rightEye={daruma.rightEyeDrawing}
              size={darumaSize}
              style={{ marginVertical: -darumaBand }}
            />

            <TextInput
              placeholder={t("view.notes_placeholder")}
              placeholderTextColor={colors.textSecondary}
              value={localNotes}
              onChangeText={handleNotesChange}
              onLayout={measure("notes")}
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

            {showDeadline && daruma.deadline != null && (
              <View onLayout={measure("deadline")} style={{ alignItems: 'center', gap: 4 }}>
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
            {showExtend && daruma.deadline && (
              <View onLayout={measure("extend")}>
                <ExtendDeadline deadline={daruma.deadline} onConfirm={handleExtendDeadline} />
              </View>
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

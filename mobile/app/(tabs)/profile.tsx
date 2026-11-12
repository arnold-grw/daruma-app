import { Pressable, ScrollView, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Text } from "@/components/typography";
import { SwapText } from "@/components/swap_text";
import { useSwitchScheme } from "@/components/theme_transition";
import ToggleButton from "@/components/toggle_button";
import DropdownSelect from "@/components/dropdown_select";
import Flag, { FLAG_MAX_WIDTH, FLAG_MIN_WIDTH } from "@/components/flag";
import useTheme from "@/constants/theme";
import { useCompletedDarumaCount, useUserStore } from "@/store/user_store";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";
import { LANGUAGES } from "@/constants/languages";
import { CenterModal } from "@/components/modals/center_modal";
import { resetApp } from "@/utils/reset_app";

export default function Profile() {
  const { colors, scheme } = useTheme();
  // dark/light switch with a cross-fade of the whole screen
  const switchScheme = useSwitchScheme();
  const activeUser = useUserStore((state) => state.activeUser);
  const updateCurrentUser = useUserStore((state) => state.updateCurrentUser);
  const completedCount = useCompletedDarumaCount();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    setConfirmReset(false);
    await resetApp();
    // the tabs see that the intro was not seen and switch to it on their own; this makes it explicit
    router.replace("/intro");
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 20, flex: 1, paddingTop: 80 }} contentContainerStyle={{ alignItems: "center" }}>
        {/* SwapText: after a language change the texts change line by line (index = order from top) */}
        <SwapText index={0} style={{ color: colors.text, fontSize: 40 }}>{activeUser?.name
          ? t("profile.welcome", { name: activeUser.name })
          : t("profile.welcome_anonymous")}</SwapText>

        <View style={{ width: "100%", marginTop: 12 }}>
          <SwapText index={1} style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.settings.title")}</SwapText>
          <ToggleButton
            label={<SwapText index={2} style={{ color: colors.text, fontSize: 16 }}>{t("profile.settings.dark_mode")}</SwapText>}
            value={scheme === "dark"}
            onValueChange={(value) => switchScheme(value ? "dark" : "light")}
            activeColor={colors.primary}
            inactiveColor={colors.textSecondary}
            textColor={colors.text}
            tabColor={colors.card}
          />
          <View style={{ height: 8 }} />
          <DropdownSelect
            label={<SwapText index={3} style={{ color: colors.text, fontSize: 16 }}>{t("profile.settings.language")}</SwapText>}
            options={LANGUAGES}
            value={language}
            onValueChange={(lang) => void setLanguage(lang)}
            renderOption={(lang, _selected, width) => (
              <Flag lang={lang} width={width} boxColor={colors.background} textColor={colors.text} />
            )}
            optionMinWidth={FLAG_MIN_WIDTH}
            optionMaxWidth={FLAG_MAX_WIDTH}
            activeColor={colors.primary}
            optionColor={colors.background}
            textColor={colors.text}
            tabColor={colors.card}
          />
          <SwapText index={4} style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.widget.title")}</SwapText>

          {/* Account at the very bottom */}
          <SwapText index={5} style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.account.title")}</SwapText>
          {/* only in development: completed darumas (they unlock colors), a tap sets them back to 0 */}
          {__DEV__ && (
            <Pressable onPress={() => void updateCurrentUser({ completedDarumaCount: 0 })} style={{ padding: 12, borderRadius: 14, backgroundColor: colors.card, marginBottom: 8 }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>Completed darumas: {completedCount} (tap to reset)</Text>
            </Pressable>
          )}
          {/* intro again, the darumas stay */}
          <Pressable
            onPress={() => router.replace("/intro")}
            style={{ padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.text }}
          >
            <SwapText index={6} style={{ color: colors.text, fontSize: 16, textAlign: "center" }}>{t("profile.account.replay_intro")}</SwapText>
          </Pressable>
          {/* deletes everything, after the warning below */}
          <Pressable
            onPress={() => setConfirmReset(true)}
            style={{ marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.danger }}
          >
            <SwapText index={7} style={{ color: colors.danger, fontSize: 16, textAlign: "center" }}>{t("profile.account.reset")}</SwapText>
          </Pressable>

          {/* only in development: entry to the 3D test page */}
          {__DEV__ && (
            <Pressable onPress={() => router.push("/daruma/model_test")} style={{ marginTop: 50, padding: 12, borderRadius: 14, backgroundColor: colors.card }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>3D Test</Text>
            </Pressable>
          )}

        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* warning before the reset, built like the one before burning a daruma */}
      <CenterModal visible={confirmReset} onClose={() => setConfirmReset(false)}>
        <Text style={{ color: colors.text, fontSize: 18, paddingRight: 30 }}>{t("profile.account.reset_confirm_title")}</Text>
        <Text style={{ color: colors.textSecondary }}>{t("profile.account.reset_confirm_text")}</Text>
        <Pressable
          onPress={() => void handleReset()}
          style={{ marginTop: 8, padding: 14, borderRadius: 12, backgroundColor: colors.danger }}
        >
          <Text style={{ color: colors.background, textAlign: "center", fontSize: 18 }}>{t("profile.account.reset_confirm")}</Text>
        </Pressable>
        <Pressable onPress={() => setConfirmReset(false)}>
          <Text style={{ textAlign: "center", color: colors.textSecondary, fontSize: 18, marginTop: 10 }}>{t("common.go_back")}</Text>
        </Pressable>
      </CenterModal>
    </View>
  );
}
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/typography";
import { SwapText } from "@/components/swap_text";
import { useSwitchScheme } from "@/components/theme_transition";
import ToggleButton from "@/components/toggle_button";
import DropdownSelect from "@/components/dropdown_select";
import Flag, { FLAG_MAX_WIDTH, FLAG_MIN_WIDTH } from "@/components/flag";
import useTheme from "@/constants/theme";
import { useUserStore } from "@/store/user_store";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";
import { LangPref } from "@/types/user";

//chinese not included until font is upgraded
const LANGUAGES: LangPref[] = ["en", "ja", "de", "fr", "es"];

export default function Profile() {
  const { colors, scheme } = useTheme();
  // dark/light switch with a cross-fade of the whole screen
  const switchScheme = useSwitchScheme();
  const activeUser = useUserStore((state) => state.activeUser);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

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
          <SwapText index={4} style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.account.title")}</SwapText>
          <SwapText index={5} style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.widget.title")}</SwapText>

          {/* only in development: entry to the 3D test page */}
          {__DEV__ && (
            <Pressable onPress={() => router.push("/daruma/model_test")} style={{ marginTop: 50, padding: 12, borderRadius: 14, backgroundColor: colors.card }}>
              <Text style={{ color: colors.text, fontSize: 16 }}>3D Test</Text>
            </Pressable>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
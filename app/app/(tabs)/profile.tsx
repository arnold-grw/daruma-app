import { ScrollView, View } from "react-native";
import { Text } from "@/components/typography";
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
  const { colors, scheme, setScheme } = useTheme();
  const activeUser = useUserStore((state) => state.activeUser);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 20, flex: 1, paddingTop: 80 }} contentContainerStyle={{ alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 40 }}>{activeUser?.name
          ? t("profile.welcome", { name: activeUser.name })
          : t("profile.welcome_anonymous")}</Text>

        <View style={{ width: "100%", marginTop: 12 }}>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.settings.title")}</Text>
          <ToggleButton
            label={t("profile.settings.dark_mode")}
            value={scheme === "dark"}
            onValueChange={(value) => setScheme(value ? "dark" : "light")}
            activeColor={colors.primary}
            inactiveColor={colors.textSecondary}
            textColor={colors.text}
            tabColor={colors.card}
          />
          <View style={{ height: 8 }} />
          <DropdownSelect
            label={t("profile.settings.language")}
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
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.account.title")}</Text>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.widget.title")}</Text>

        </View>
      </ScrollView>
    </View>
  );
}
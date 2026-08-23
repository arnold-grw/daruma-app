import { useEffect, useRef } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Text } from "@/components/typography";
import ToggleButton from "@/components/toggle_button";
import useTheme from "@/constants/theme";
import { useUserStore } from "@/store/user_store";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/language_store";

export default function Profile() {
  const { colors, scheme, setScheme } = useTheme();
  const activeUser = useUserStore((state) => state.activeUser);
  const loadUsers = useUserStore((state) => state.load);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { t } = useTranslation();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    void loadUsers();
  }, [loadUsers]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 20, flex: 1, paddingTop: 40 }} contentContainerStyle={{ alignItems: "center" }}>
        <Text style={{ color: colors.text, fontSize: 40 }}>{t("profile.welcome", { name: activeUser?.name ?? "User" })}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 24 }}>{activeUser?.email ?? ""}</Text>

        <View style={{ width: "100%", marginTop: 24 }}>
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
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.account.title")}</Text>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>{t("profile.widget.title")}</Text>

          <View style={{ marginTop: 24 }}>
            <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>Language</Text>
            <View style={{ flexDirection: "row" }}>
              {(["en", "de", "jp", "fr", "es"] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => void setLanguage(lang as any)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: language === lang ? colors.primary : colors.card,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: language === lang ? "white" : colors.text }}>{lang.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
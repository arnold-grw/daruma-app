import Daruma3D from "@/components/3d/daruma_model";
import Flag from "@/components/flag";
import { Text } from "@/components/typography";
import { LANGUAGE_NAMES, LANGUAGES } from "@/constants/languages";
import useTheme from "@/constants/theme";
import { useLanguageStore } from "@/store/language_store";
import { DarumaColor } from "@/types/daruma";
import { DrawingData } from "@/types/drawing";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";

// height of the 3D daruma on the intro pages (px), a bit smaller than on the 3D test page (300);
// on small screens at most this share of the screen height, so title and text still fit
const DARUMA_SIZE = 270;
const DARUMA_MAX_HEIGHT_RATIO = 0.32;
// side padding of the pages; the 3D view reaches past it to the screen edges (room for turning and wobbling)
const PAGE_PADDING = 30;
// flags on the language page
const LANGUAGE_FLAG_WIDTH = 40;

// a painted eye for the example darumas: two thick round strokes that fill the eye
const circle = (radius: number) => Array.from({ length: 25 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
});
const PAINTED_EYE: DrawingData = {
  lines: [{ width: 1.0, points: circle(0.15) }],
};

// 3D daruma like on the 3D test page: drag sideways to turn it, tap to make it wobble
function IntroDaruma({ color = "red", eyes }: { color?: DarumaColor; eyes: 0 | 1 | 2 }) {
  const { height } = useWindowDimensions();
  const size = Math.min(DARUMA_SIZE, height * DARUMA_MAX_HEIGHT_RATIO);
  return (
    <Daruma3D
      color={color}
      leftEye={eyes >= 1 ? PAINTED_EYE : undefined}
      rightEye={eyes === 2 ? PAINTED_EYE : undefined}
      size={size}
      style={{ marginHorizontal: -PAGE_PADDING }}
    />
  );
}

// layout shared by all pages: picture, title and text, centered; scrolls if the text does not fit
function IntroPage({ image, title, text, children }: { image?: ReactNode; title: string; text?: string; children?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: PAGE_PADDING, paddingVertical: 20, gap: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {image}
      <Text style={{ color: colors.text, fontSize: 28, textAlign: "center" }}>{title}</Text>
      {text != null && (
        <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center", lineHeight: 26 }}>{text}</Text>
      )}
      {children}
    </ScrollView>
  );
}

export function WelcomePage() {
  const { t } = useTranslation();
  return <IntroPage image={<IntroDaruma eyes={0} />} title={t("intro.welcome.title")} text={t("intro.welcome.text")} />;
}

export function LanguagePage() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <IntroPage title={t("intro.language.title")} text={t("intro.language.text")}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, width: "100%", maxWidth: 400 }}>
        {LANGUAGES.map((lang) => {
          const selected = lang === language;
          return (
            <Pressable
              key={lang}
              onPress={() => void setLanguage(lang)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={{
                width: "47%",
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                borderWidth: 3,
                borderColor: selected ? colors.primary : "transparent",
                backgroundColor: colors.card,
              }}
            >
              <Flag lang={lang} width={LANGUAGE_FLAG_WIDTH} boxColor={colors.background} textColor={colors.text} />
              <Text style={{ color: colors.text, fontSize: 16, flexShrink: 1 }} numberOfLines={1}>{LANGUAGE_NAMES[lang]}</Text>
            </Pressable>
          );
        })}
      </View>
    </IntroPage>
  );
}

export function TraditionPage() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <IntroPage image={<IntroDaruma eyes={0} />} title={t("intro.tradition.title")} text={t("intro.tradition.text")}>
      {/* the first page where it is worth trying: the figure can be turned and tapped */}
      {/*<Text style={{ color: colors.primary, fontSize: 16, textAlign: "center" }}>{t("intro.tradition.hint")}</Text>*/}
    </IntroPage>
  );
}

export function FirstEyePage() {
  const { t } = useTranslation();
  return <IntroPage image={<IntroDaruma eyes={1} />} title={t("intro.first_eye.title")} text={t("intro.first_eye.text")} />;
}

export function SecondEyePage() {
  const { t } = useTranslation();
  return <IntroPage image={<IntroDaruma eyes={2} />} title={t("intro.second_eye.title")} text={t("intro.second_eye.text")} />;
}

export function FirstDarumaPage({ onLater }: { onLater: () => void }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <IntroPage image={<IntroDaruma eyes={0} />} title={t("intro.first_daruma.title")} text={t("intro.first_daruma.text")}>
      <Pressable onPress={onLater} hitSlop={10}>
        <Text style={{ color: colors.textSecondary, fontSize: 18, textDecorationLine: "underline" }}>{t("intro.first_daruma.later")}</Text>
      </Pressable>
    </IntroPage>
  );
}

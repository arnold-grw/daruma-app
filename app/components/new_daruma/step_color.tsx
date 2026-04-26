// components/new_daruma/StepColor.tsx
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/typography";
import { StepProps } from "@/app/daruma/new";
import useTheme from "@/constants/theme";
import ColorPicker from "@/components/color_picker";
import { getDarumaColor } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";

export function StepColor({ draft, setDraft, onValidChange }: StepProps) {
  const { colors } = useTheme();
  const colorConfig = getDarumaColor(draft.color);

  useEffect(() => {
    onValidChange(true); // color always has a default, always valid
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Text style={{ fontSize: 24, textAlign: "center", paddingBottom: 20}}>First choose a color that resonates with your goal</Text>
      <ColorPicker
        selected={draft.color}
        onSelect={(color: DarumaColor) => setDraft({ color })}
      />
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ color: colorConfig.hex, fontSize: 18, fontWeight: "600" }}>
          {colorConfig.label}
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          {colorConfig.meaning}
        </Text>
      </View>
    </View>
  );
}
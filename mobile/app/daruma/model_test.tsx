import Daruma3D from "@/components/3d/daruma_model";
import { Text } from "@/components/typography";
import { DARUMA_COLORS } from "@/constants/daruma_colors";
import useTheme from "@/constants/theme";
import { DarumaColor } from "@/types/daruma";
import { safeBack } from "@/utils/navigation";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Test page for the 3D daruma: drag to turn it, tap a dot to change the color
export default function ModelTest() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [color, setColor] = useState<DarumaColor>("red");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginTop: 20 }}>3D Test</Text>

      <Daruma3D color={color} style={{ flex: 1 }} />

      {/* one dot per color */}
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        {DARUMA_COLORS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setColor(c.id)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: c.hex,
              borderWidth: 3,
              borderColor: c.id === color ? colors.text : "transparent",
            }}
          />
        ))}
      </View>

      <Pressable onPress={() => safeBack()} style={{ alignSelf: "center", padding: 10 }}>
        <Text style={{ fontSize: 18, color: colors.textSecondary }}>Zurück</Text>
      </Pressable>
    </View>
  );
}

import { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/typography";
import ToggleButton from "@/components/toggle_button";
import useTheme from "@/constants/theme";
import { useUserStore } from "@/store/user_store";

export default function Profile() {
  const { colors, scheme, setScheme } = useTheme();
  const activeUser = useUserStore((state) => state.activeUser);
  const loadUsers = useUserStore((state) => state.load);
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
        <Text style={{ color: colors.text, fontSize: 40 }}>Hi {activeUser?.name ?? "User"},</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 24 }}>{activeUser?.email ?? ""}</Text>

        <View style={{ width: "100%", marginTop: 24 }}>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>Settings</Text>
          <ToggleButton
            label="Dark mode"
            value={scheme === "dark"}
            onValueChange={(value) => setScheme(value ? "dark" : "light")}
            activeColor={colors.primary}
            inactiveColor={colors.textSecondary}
            textColor={colors.text}
            tabColor={colors.card}
          />
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>Account</Text>
          <Text style={{ color: colors.text, fontSize: 24, marginBottom: 12, marginTop: 50 }}>Widget</Text>
        </View>
      </ScrollView>
    </View>
  );
}
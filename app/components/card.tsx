import { Pressable } from "react-native";
import { Text } from '@/components/typography';
import { Daruma } from "@/types/daruma";
import useTheme from "@/constants/theme";
import { router } from "expo-router";
import { DarumaDisplay } from "./daruma/daruma_display";

interface CardProps {
  daruma: Daruma;
}

export default function Card({ daruma }: CardProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/daruma/view',
      params: { darumaId: daruma.id }
    });
  };

  return (
    <Pressable
      key={daruma.id}
      onPress={handlePress}
      style={{ marginBottom: 30, backgroundColor: colors.card, padding: 20, borderRadius: 40, alignItems: "center" }}
    >
      <DarumaDisplay daruma={daruma} />
      <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text, marginTop: 10, maxWidth: 315 }}>{daruma.goal}</Text>
    </Pressable>
  );
}

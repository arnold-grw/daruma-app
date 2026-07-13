import { Text } from '@/components/typography';
import useTheme from "@/constants/theme";
import { Daruma } from "@/types/daruma";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { DarumaDisplay } from "./daruma/daruma_display";

interface CardProps {
  daruma: Daruma;
  grayscale?: boolean;
}

export default function Card({ daruma, grayscale = false }: CardProps) {
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
      {grayscale ? (
        <View style={{ filter: 'grayscale(1)' }}>
          <DarumaDisplay daruma={daruma} />
        </View>
      ) : (
        <DarumaDisplay daruma={daruma} />
      )}
      <Text style={{ textAlign: 'center', fontSize: 24, color: colors.text, marginTop: 10, maxWidth: 315 }}>{daruma.goal}</Text>
    </Pressable>
  );
}

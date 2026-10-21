import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { ReactNode } from "react";
import { View } from "react-native";

interface EmptyStateProps {
  title: string;
  text: string;
  // Optional graphic above the text (e.g. later a Daruma without eyes)
  image?: ReactNode;
}

// Centered placeholder for screens without content
export default function EmptyState({ title, text, image }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, gap: 12 }}>
      {image}
      <Text style={{ color: colors.textSecondary, fontSize: 24, textAlign: "center" }}>{title}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 18, textAlign: "center" }}>{text}</Text>
    </View>
  );
}

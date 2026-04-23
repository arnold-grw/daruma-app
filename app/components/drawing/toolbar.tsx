import { DrawingSettings } from "@/types/drawing";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

interface Props {
  height: number;
  width: number,
  settings: DrawingSettings;
  onThicknessChange: (value: number) => void;
  onRemoveLastLine: () => void;
}

export function Toolbar({
  height = 200,
  width = 75,
  settings,
  onThicknessChange,
  onRemoveLastLine,
}: Props) {
  // Höhe des Sliders = verfügbarer vertikaler Platz (abzüglich Button + Padding)
  const sliderLength = height * 0.7;

  return (
    <View style={[styles.container, { height, width }]}>
      {/* Vertikaler Slider Container */}
      <View style={[styles.sliderContainer, { height: sliderLength }]}>
        <Slider
          style={{
            width: sliderLength, // ← getauscht: Breite = gewünschte Höhe
            height: 40,
            transform: [{ rotate: "-90deg" }], // ← dreht den Slider
          }}
          minimumValue={0.0}
          maximumValue={0.5}
          step={0.05}
          value={settings.thickness}
          onValueChange={onThicknessChange}
          minimumTrackTintColor="#307ecc"
          maximumTrackTintColor="#000000"
        />
      </View>

      {/* Button to Remove Last Line */}
      <Pressable style={styles.button} onPress={onRemoveLastLine}>
        <Text style={styles.buttonText}>X</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    flexDirection: "column",
  },
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  button: {
    marginTop: 10,
    padding: 20,
    backgroundColor: "#ff6b6b",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
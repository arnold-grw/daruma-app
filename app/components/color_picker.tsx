import { DARUMA_COLORS } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";
import React from "react";
import { Dimensions, View } from "react-native";
import { Carousel } from "react-native-reanimated-carousel";
import { DarumaDetails } from "./daruma/daruma_details";

interface Props {
  selected: DarumaColor
  onSelect: (color: DarumaColor) => void
}

export default function ColorPicker({ selected, onSelect }: Props) {

    const { width } = Dimensions.get("window");
    const carouselWidth = width;
    const cardWidth = Math.min(carouselWidth, 600);
    const cardHeight = cardWidth * 1.028

    const startIndex = DARUMA_COLORS.findIndex(c => c.id === selected)

  return (
    <Carousel
      style={{ width: carouselWidth, height: cardWidth }}
      data={DARUMA_COLORS}
      loop
      defaultIndex={startIndex}
      onSnapToItem={(index) => onSelect(DARUMA_COLORS[index].id)}
      renderItem={({ item }) => (
        <View
          style={{
            alignSelf: "center", marginTop: -20,
            // the images must not catch the pointer: in the browser, dragging an image starts a native image drag that cancels the swipe
            pointerEvents: "none",
          }}
          >
            <DarumaDetails color={item.id} width={cardWidth} height={cardHeight} />
        </View>
      )}
      layout={{
        type: "parallax",
        scale: 0.8,
        offset: cardWidth * 0.25,
      }}
    />
  )
}
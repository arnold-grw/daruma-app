import { DARUMA_COLORS } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Carousel } from "react-native-reanimated-carousel";
import DarumaCarouselScene from "./3d/daruma_carousel_scene";
import { DARUMA_ASPECT } from "./daruma/daruma_details";

// space between the middle daruma and its (smaller) neighbours
const NEIGHBOR_GAP = 12;
// size of the neighbours relative to the middle daruma (roughly; in 3D they get smaller by moving back)
const NEIGHBOR_SCALE = 0.8;
const COLORS = DARUMA_COLORS.map((c) => c.id);

interface Props {
  selected: DarumaColor
  onSelect: (color: DarumaColor) => void
  // called while swiping with the color that is closest to the middle (before the carousel snaps)
  onPreview?: (color: DarumaColor) => void
  // width of the daruma in the middle; the carousel is exactly as high as that daruma
  size: number
}

export default function ColorPicker({ selected, onSelect, onPreview, size }: Props) {

    const { width } = useWindowDimensions();
    const height = size * DARUMA_ASPECT;
    // distance between the centers of two darumas: half of the middle one + half of a neighbour + gap,
    // so they sit close together without overlapping, on every screen width
    const spacing = size / 2 + (size * NEIGHBOR_SCALE) / 2 + NEIGHBOR_GAP;

    const startIndex = DARUMA_COLORS.findIndex(c => c.id === selected)
    // current carousel position, updated every frame while swiping; the 3D scene places the darumas by it
    const progress = useSharedValue(startIndex);

    // progress is the position as a decimal index (e.g. 2.4 = between the 3rd and 4th daruma, closer to the 3rd);
    // rounding gives the daruma that is more than halfway in the middle. With loop it can be negative or too large.
    const handleProgressChange = (progress: number) => {
      const count = DARUMA_COLORS.length;
      const index = ((Math.round(progress) % count) + count) % count;
      onPreview?.(DARUMA_COLORS[index].id);
    };

  return (
    <View style={{ width, height }}>
    {/* the 3D darumas are drawn behind the carousel; the carousel itself is empty and only handles the swiping */}
    <DarumaCarouselScene colors={COLORS} progress={progress} spacing={spacing} width={width} height={height} />
    <Carousel
      style={{ width, height }}
      data={DARUMA_COLORS}
      loop
      defaultIndex={startIndex}
      onSnapToItem={(index) => onSelect(DARUMA_COLORS[index].id)}
      onProgressChange={handleProgressChange}
      progress={progress}
      renderItem={() => <View style={{ flex: 1 }} />}
      layout={{
        type: "parallax",
        // the middle daruma is shown at full size, so its size is exactly `size`
        scale: 1,
        adjacentScale: NEIGHBOR_SCALE,
        // the layout moves a neighbour by (width - offset), so this places it at `spacing`
        offset: width - spacing,
      }}
    />
    </View>
  )
}

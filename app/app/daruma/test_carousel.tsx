import React from "react";
import { FlatList, View, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = 120;
const SPACING = 20;

const data = ["red", "blue", "green", "yellow", "pink"];

export default function Carousel() {
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH + SPACING}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: (width - ITEM_WIDTH) / 2
      }}
      renderItem={({ item }) => (
        <View
          style={{
            width: ITEM_WIDTH,
            height: 120,
            marginHorizontal: SPACING / 2,
            backgroundColor: item,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "white" }}>{item}</Text>
        </View>
      )}
    />
  );
}
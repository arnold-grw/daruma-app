import { Text } from "@/components/typography";
import useTheme from "@/constants/theme";
import { useCallback, useEffect, useRef } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, View } from "react-native";

interface WheelPickerProps<T> {
  items: T[];
  selectedIndex: number;
  onChange: (index: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  renderLabel: (item: T) => string;
  width?: number;
}

export function WheelPicker<T>({
  items,
  selectedIndex,
  onChange,
  itemHeight = 44,
  visibleCount = 3,
  renderLabel,
  width = 80,
}: WheelPickerProps<T>) {
  const { colors } = useTheme();
  const listRef = useRef<FlatList>(null);
  const containerHeight = itemHeight * visibleCount;
  const paddingCount = Math.floor(visibleCount / 2);

  // Verhindert, dass unser eigener programmatischer Scroll (nach Auswahl)
  // erneut onChange auslöst und eine Feedback-Schleife erzeugt.
  const lastScrolledIndex = useRef(selectedIndex);
  const isProgrammaticScroll = useRef(false);

  const clampIndex = (i: number) => Math.max(0, Math.min(items.length - 1, i));

  const scrollToIndex = (index: number, animated = true) => {
    isProgrammaticScroll.current = true;
    lastScrolledIndex.current = index;
    listRef.current?.scrollToOffset({ offset: index * itemHeight, animated });
  };

  // Wenn sich selectedIndex von AUSSEN ändert (z.B. weil sich das Jahr geändert
  // hat und dadurch die Tage-Liste neu berechnet wurde), das Wheel mitziehen.
  useEffect(() => {
    if (selectedIndex !== lastScrolledIndex.current) {
      scrollToIndex(selectedIndex, false); // ohne Animation = sofortiger Sync
    }
  }, [selectedIndex, items.length]);

  const commitIndex = useCallback(
    (index: number) => {
      const clamped = clampIndex(index);
      if (clamped !== selectedIndex) {
        onChange(clamped);
      }
      // Immer exakt nachkorrigieren, damit es nie "zwischen" Werten stehen bleibt
      scrollToIndex(clamped, true);
    },
    [selectedIndex, onChange]
  );

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        return;
      }
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / itemHeight);
      commitIndex(index);
    },
    [itemHeight, commitIndex]
  );

  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Fängt kurze Swipes ohne echtes "Momentum" ab (v.a. auf Android relevant)
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / itemHeight);
      commitIndex(index);
    },
    [itemHeight, commitIndex]
  );

  const handlePress = (index: number) => {
    commitIndex(index); // sofort committen, unabhängig vom Scroll-Event
  };

  return (
    <View style={{ height: containerHeight, width }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: paddingCount * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
          borderRadius: 12,
          backgroundColor: colors.card,
          zIndex: -1,
        }}
      />
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: paddingCount * itemHeight }}
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, i) => ({ length: itemHeight, offset: itemHeight * i, index: i })}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={handleScrollEndDrag}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <Pressable
              onPress={() => handlePress(index)}
              style={{ height: itemHeight, justifyContent: "center", alignItems: "center" }}
            >
              <Text
                style={{
                  fontFamily: "MyFont",
                  fontSize: isSelected ? 22 : 18,
                  color: isSelected ? colors.text : colors.textSecondary,
                  opacity: isSelected ? 1 : 0.5,
                }}
              >
                {renderLabel(item)}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
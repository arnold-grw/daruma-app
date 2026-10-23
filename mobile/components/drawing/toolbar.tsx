import { getStrokeWidth, VIEWBOX_SIZE } from "@/components/drawing/drawing_renderer";
import useTheme, { shadowStyle } from "@/constants/theme";
import { DrawingSettings } from "@/types/drawing";
import { Pressable, View } from "react-native";
import { UndoIcon } from "../icons/toolbar_icons";

interface Props {
  width: number;
  settings: DrawingSettings;
  onThicknessChange: (value: number) => void;
  onRemoveLastLine: () => void;
}

// the three pen sizes to choose from (line width, see getStrokeWidth in drawing_renderer.tsx)
export const PEN_SIZES = [0.15, 0.3, 0.45];

// size of every tool box (px); gap, frame, dots and the undo icon scale with it
export const TOOL_BOX_SIZE = 64;
// space between the boxes
const GAP = TOOL_BOX_SIZE * 0.19;
// frame of the chosen pen size
const SELECTED_BORDER = TOOL_BOX_SIZE * 0.08;
// size of the preview dot per share of the drawing area the stroke covers
const DOT_SCALE = TOOL_BOX_SIZE * 1.55;
// undo icon size
const ICON_SIZE = TOOL_BOX_SIZE * 0.55;

const BORDER_RADIUS = TOOL_BOX_SIZE * 0.25;

/** One box per pen size (the chosen one gets a frame) and the undo box below, all the same size. */
export function Toolbar({
  width = 75,
  settings,
  onThicknessChange,
  onRemoveLastLine,
}: Props) {
  const { colors, shadows } = useTheme();

  const box = {
    width: TOOL_BOX_SIZE,
    height: TOOL_BOX_SIZE,
    borderRadius: BORDER_RADIUS,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...shadowStyle(shadows),
  };

  return (
    <View style={{ width, alignItems: "center", gap: GAP }}>
      {/* Pen sizes: each box shows a dot as thick as its stroke */}
      {PEN_SIZES.map((size) => {
        const selected = settings.thickness === size;
        const dot = (getStrokeWidth(size) / VIEWBOX_SIZE) * DOT_SCALE;
        return (
          <Pressable
            key={size}
            onPress={() => onThicknessChange(size)}
            style={{
              ...box,
              backgroundColor: colors.card,
              // the frame is always there (transparent when not chosen), so the dot does not move
              borderWidth: SELECTED_BORDER,
              borderColor: selected ? colors.primary : "transparent",
            }}
          >
            <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: colors.text }} />
          </Pressable>
        );
      })}

      {/* Undo button */}
      <Pressable style={{ ...box, backgroundColor: colors.primary }} onPress={onRemoveLastLine}>
        <UndoIcon color={colors.background} size={ICON_SIZE} />
      </Pressable>
    </View>
  );
}

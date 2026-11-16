// three.js elements (group) have props the React DOM lint rule does not know
/* eslint-disable react/no-unknown-property */
import { DarumaColor } from "@/types/daruma";
import { Canvas, useFrame } from "@react-three/fiber/native";
import { Suspense, useRef } from "react";
import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import * as THREE from "three";
import { DarumaModel, FRONT_ROTATION, MODEL_HEIGHT } from "./daruma_model";

// camera field of view (degrees); smaller = flatter, larger = stronger perspective
const FOV = 2;
// share of the view height the middle daruma fills
const FILL = 0.95;
// how far a neighbour moves back (in middle-daruma heights); further back = smaller
const DEPTH = 2.0;
// how dark a neighbour gets (0 = not at all, 1 = black)
const NEIGHBOR_DIM = 0.5;
// how much a neighbour turns its face towards the middle (radians)
const NEIGHBOR_TURN = 0.75;
// darumas further away than this (in positions) are hidden
const VISIBLE_RANGE = 2;

// camera distance at which the middle daruma fills FILL of the view height
const CAMERA_DISTANCE = MODEL_HEIGHT / FILL / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));
const VIEW_HEIGHT = 2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV) / 2);

interface SceneProps {
  colors: DarumaColor[];
  // shown in gray
  lockedColors: DarumaColor[];
  // carousel position as a decimal index (e.g. 2.4 = between the 3rd and 4th daruma)
  progress: SharedValue<number>;
  // distance between two darumas on screen (px) and the height of the view (px)
  spacing: number;
  height: number;
}

/** Places every daruma by the carousel position: the selected one in front, the others further back, smaller and darker. */
function CarouselDarumas({ colors, lockedColors, progress, spacing, height }: SceneProps) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  // screen px -> scene units at the depth of the middle daruma
  const spacingInScene = spacing * (VIEW_HEIGHT / height);

  useFrame(() => {
    const count = colors.length;
    const current = progress.get();
    groups.current.forEach((group, index) => {
      if (!group) return;
      // signed distance to the middle, the shorter way around (the carousel loops)
      const distance = ((((index - current) % count) + count + count / 2) % count) - count / 2;
      const away = Math.min(Math.abs(distance), VISIBLE_RANGE);
      group.visible = Math.abs(distance) < VISIBLE_RANGE;

      const z = -away * DEPTH * MODEL_HEIGHT;
      // further back things look smaller, so x is scaled up to keep the on-screen spacing
      const perspective = (CAMERA_DISTANCE - z) / CAMERA_DISTANCE;
      group.position.set(distance * spacingInScene * perspective, 0, z);
      group.rotation.y = FRONT_ROTATION - Math.sign(distance) * Math.min(away, 1) * NEIGHBOR_TURN;

      const dim = 1 - Math.min(away, 1) * NEIGHBOR_DIM;
      group.traverse((child) => {
        const material = (child as THREE.Mesh).material as THREE.ShaderMaterial | undefined;
        if (material?.uniforms?.dim) material.uniforms.dim.value = dim;
      });
    });
  });

  return (
    <>
      {colors.map((color, index) => (
        <group key={color} ref={(group) => { groups.current[index] = group; }}>
          <DarumaModel color={color} grayscale={lockedColors.includes(color)} />
        </group>
      ))}
    </>
  );
}

/** One 3D view showing all darumas of the color carousel; it only draws, the swiping is done by the carousel above it. */
export default function DarumaCarouselScene(props: SceneProps & { width: number }) {
  const { width, height } = props;
  return (
    <View style={{ position: "absolute", width, height, pointerEvents: "none" }}>
      <Canvas
        flat
        camera={{ position: [0, MODEL_HEIGHT / 2, CAMERA_DISTANCE], fov: FOV }}
        onCreated={({ camera }) => camera.lookAt(0, MODEL_HEIGHT / 2, 0)}
      >
        <Suspense fallback={null}>
          <CarouselDarumas {...props} />
        </Suspense>
      </Canvas>
    </View>
  );
}

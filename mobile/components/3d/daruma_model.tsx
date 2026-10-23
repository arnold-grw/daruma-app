// three.js elements (mesh, group, lights) have props the React DOM lint rule does not know
/* eslint-disable react/no-unknown-property */
import { getDarumaColor } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import { ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createToonMaterial } from "./toon_material";

// exported from Blender (only the shape and UVs are used, not its material)
const MODEL = require("@/assets/models/daruma.glb");
// face: drawn without light; writing: lit like the body. Both use the UV layout of the model.
const FACE_TEXTURE = require("@/assets/textures/daruma_face.png");
const WRITING_TEXTURE = require("@/assets/textures/daruma_writing.png");

// height of the daruma in the scene (the model is scaled to it, whatever its size in Blender)
const MODEL_HEIGHT = 1.5;
// turns the model so its face looks at the camera (in the Blender file the face points along +x)
const FRONT_ROTATION = -Math.PI / 2;
// how fast the daruma turns while dragging (radians per pixel)
const DRAG_SPEED = 0.01;
// how quickly the spin slows down after letting go (share of speed kept per frame)
const SPIN_DAMPING = 0.95;

/**
 * Reads the meshes from the loaded file. Their geometry is copied and moved/scaled,
 * so the daruma is MODEL_HEIGHT high, stands on y = 0 and is centered on x/z, whatever its size in Blender.
 */
function prepareModel(gltf: GLTF) {
  gltf.scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = MODEL_HEIGHT / size.y;
  const normalize = new THREE.Matrix4()
    .makeScale(scale, scale, scale)
    .multiply(new THREE.Matrix4().makeTranslation(-center.x, -box.min.y, -center.z));

  const parts: { name: string; geometry: THREE.BufferGeometry }[] = [];
  gltf.scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry.clone();
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalize, mesh.matrixWorld));
    parts.push({ name: mesh.name, geometry });
  });
  return parts;
}

/** Copy of a loaded texture with the settings textures on glTF models need. */
function prepareTexture(loaded: THREE.Texture) {
  const texture = loaded.clone();
  // glTF UVs start at the top left, not bottom left
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** The daruma mesh; must be placed inside a <Canvas>. */
export function DarumaModel({ color }: { color: DarumaColor }) {
  const gltf = useLoader(GLTFLoader, MODEL) as GLTF;
  const { hex } = getDarumaColor(color);

  const [loadedFace, loadedWriting] = useLoader(THREE.TextureLoader, [FACE_TEXTURE, WRITING_TEXTURE]);

  const parts = useMemo(() => prepareModel(gltf), [gltf]);
  const faceTexture = useMemo(() => prepareTexture(loadedFace), [loadedFace]);
  const writingTexture = useMemo(() => prepareTexture(loadedWriting), [loadedWriting]);
  const material = useMemo(
    () => createToonMaterial(faceTexture, writingTexture, hex, color === "gold"),
    [faceTexture, writingTexture, hex, color]
  );

  // free the GPU memory of replaced materials and geometries
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => faceTexture.dispose(), [faceTexture]);
  useEffect(() => () => writingTexture.dispose(), [writingTexture]);
  useEffect(() => () => parts.forEach((part) => part.geometry.dispose()), [parts]);

  return (
    <group>
      {parts.map((part) => (
        <mesh key={part.name} geometry={part.geometry} material={material} />
      ))}
    </group>
  );
}

interface TurntableProps {
  // rotation per frame (radians), set by dragging
  speed: SharedValue<number>;
  dragging: SharedValue<boolean>;
  children: ReactNode;
}

/** Turns its children around the vertical axis. */
function Turntable({ speed, dragging, children }: TurntableProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y += speed.get();
    // keep turning a little after letting go, then slow down
    if (!dragging.get()) speed.set(speed.get() * SPIN_DAMPING);
  });

  return <group ref={group} rotation-y={FRONT_ROTATION}>{children}</group>;
}

interface Daruma3DProps {
  color: DarumaColor;
  style?: StyleProp<ViewStyle>;
}

/** 3D daruma that can be turned with a finger. */
export default function Daruma3D({ color, style }: Daruma3DProps) {
  // shared between the gesture and the render loop (useFrame)
  const speed = useSharedValue(0);
  const dragging = useSharedValue(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      dragging.set(true);
      speed.set(0);
    })
    .onChange((e) => {
      // changeX: how far the finger moved since the last event
      speed.set(e.changeX * DRAG_SPEED);
    })
    .onFinalize(() => {
      dragging.set(false);
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={style}>
        {/* flat: no tone mapping, so the colors stay as defined in daruma_colors */}
        <Canvas
          flat
          camera={{ position: [0, 1, 5], fov: 35 }}
          onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
        >
          {/* no three.js lights: the toon material has its own light, see toon_settings.ts */}
          <Suspense fallback={null}>
            <Turntable speed={speed} dragging={dragging}>
              <DarumaModel color={color} />
            </Turntable>
          </Suspense>
        </Canvas>
      </View>
    </GestureDetector>
  );
}

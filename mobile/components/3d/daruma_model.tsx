// three.js elements (mesh, group, lights) have props the React DOM lint rule does not know
/* eslint-disable react/no-unknown-property */
import { useWiggle } from "@/components/daruma/daruma_wiggle";
import { getDarumaColor } from "@/constants/daruma_colors";
import { DarumaColor } from "@/types/daruma";
import { DrawingData } from "@/types/drawing";
import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import { ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createEyeTexture } from "./eye_texture";
import { createToonMaterial } from "./toon_material";

// exported from Blender (only the shape and UVs are used, not its material)
const MODEL = require("@/assets/models/daruma.glb");
// face: drawn without light; writing: lit like the body. Both use the UV layout of the model.
const FACE_TEXTURE = require("@/assets/textures/daruma_face.png");
const WRITING_TEXTURE = require("@/assets/textures/daruma_writing.png");

// height of the daruma in the scene (the model is scaled to it, whatever its size in Blender)
export const MODEL_HEIGHT = 1.5;
// turns the model so its face looks at the camera (in the Blender file the face points along +x)
export const FRONT_ROTATION = -Math.PI / 2;
// how fast the daruma turns while dragging (radians per pixel)
const DRAG_SPEED = 0.01;
// how quickly the spin slows down after letting go (share of speed kept per frame)
const SPIN_DAMPING = 0.95;
// camera field of view (degrees); smaller = flatter, larger = stronger perspective
const FOV = 2;
// height of the 3D view compared to the daruma, so it does not touch the top and bottom edge
export const VIEW_HEIGHT_RATIO = 1.1;
// finger movement (px) before turning starts; moving up or down first lets a surrounding ScrollView scroll instead
const DRAG_THRESHOLD = 10;
// height the daruma rocks around when it wobbles (its round bottom), the same spot as in 2D (140 px below the middle of 324 px)
const WIGGLE_PIVOT = MODEL_HEIGHT * (0.5 - 140 / 324);
// how strong a tap makes it wobble (same as tapping the 2D daruma)
const TAP_IMPULSE = 150;

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
  // on the phone @react-three/fiber marks loaded textures as data textures so expo-gl can upload them.
  // clone() drops that flag, and without it the texture stays empty
  (texture as THREE.Texture & { isDataTexture?: boolean }).isDataTexture =
    (loaded as THREE.Texture & { isDataTexture?: boolean }).isDataTexture;
  // glTF UVs start at the top left, not bottom left
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

interface DarumaModelProps {
  color: DarumaColor;
  // painted eyes, as saved on the daruma (left eye = right side of the face as seen by the viewer)
  leftEye?: DrawingData;
  rightEye?: DrawingData;
  // drawn in gray, e.g. a color that is still locked
  grayscale?: boolean;
}

/** The daruma mesh; must be placed inside a <Canvas>. */
export function DarumaModel({ color, leftEye, rightEye, grayscale = false }: DarumaModelProps) {
  const gltf = useLoader(GLTFLoader, MODEL) as GLTF;
  const { hex } = getDarumaColor(color);

  const [loadedFace, loadedWriting] = useLoader(THREE.TextureLoader, [FACE_TEXTURE, WRITING_TEXTURE]);

  const parts = useMemo(() => prepareModel(gltf), [gltf]);
  const faceTexture = useMemo(() => prepareTexture(loadedFace), [loadedFace]);
  const writingTexture = useMemo(() => prepareTexture(loadedWriting), [loadedWriting]);
  const eyeTexture = useMemo(() => createEyeTexture(leftEye, rightEye), [leftEye, rightEye]);
  const material = useMemo(
    () => createToonMaterial(faceTexture, writingTexture, eyeTexture, hex, color === "gold", grayscale),
    [faceTexture, writingTexture, eyeTexture, hex, color, grayscale]
  );

  // free the GPU memory of replaced materials and geometries
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => faceTexture.dispose(), [faceTexture]);
  useEffect(() => () => writingTexture.dispose(), [writingTexture]);
  useEffect(() => () => eyeTexture.dispose(), [eyeTexture]);
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
  // wobble tilt in degrees (positive = top to the right), from useWiggle
  tilt: SharedValue<number>;
  children: ReactNode;
}

/** Turns its children around the vertical axis and tilts them sideways for the wobble. */
function Turntable({ speed, dragging, tilt, children }: TurntableProps) {
  const turn = useRef<THREE.Group>(null);
  const wobble = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!turn.current || !wobble.current) return;
    turn.current.rotation.y += speed.get();
    // keep turning a little after letting go, then slow down
    if (!dragging.get()) speed.set(speed.get() * SPIN_DAMPING);
    // around the axis pointing at the camera; three.js turns counterclockwise, so minus for "top to the right"
    wobble.current.rotation.z = -THREE.MathUtils.degToRad(tilt.get());
  });

  // the wobble group sits at the pivot, so the daruma rocks on its bottom instead of spinning around its middle
  return (
    <group ref={wobble} position-y={WIGGLE_PIVOT}>
      <group position-y={-WIGGLE_PIVOT}>
        <group ref={turn} rotation-y={FRONT_ROTATION}>{children}</group>
      </group>
    </group>
  );
}

/**
 * Moves the camera so the daruma is `size` px high on screen, whatever size the 3D view has.
 * Checked every frame, so it also follows when the view changes size (e.g. turning the device).
 */
function FitCamera({ size }: { size: number }) {
  useFrame(({ camera, size: view }) => {
    // scene units per screen pixel at which MODEL_HEIGHT is `size` px, and the camera distance for that
    const unitsPerPixel = MODEL_HEIGHT / size;
    const distance = (view.height * unitsPerPixel) / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2));
    if (camera.position.z === distance) return;
    camera.position.set(0, MODEL_HEIGHT / 2, distance);
    camera.lookAt(0, MODEL_HEIGHT / 2, 0);
    camera.far = distance * 2;
    camera.updateProjectionMatrix();
  });
  return null;
}

interface Daruma3DProps extends DarumaModelProps {
  // height of the daruma on screen (px)
  size: number;
  // the view is as wide as the screen (room for the wobble) and a bit higher than the daruma; style can change that
  style?: StyleProp<ViewStyle>;
}

/** 3D daruma in a screen-wide view: drag sideways to turn it, tap to make it wobble. */
export default function Daruma3D({ color, leftEye, rightEye, size, style }: Daruma3DProps) {
  const { width: windowWidth } = useWindowDimensions();
  // shared between the gesture and the render loop (useFrame)
  const speed = useSharedValue(0);
  const dragging = useSharedValue(false);
  const { rotation: tilt, applyImpulse } = useWiggle();

  const pan = Gesture.Pan()
    .activeOffsetX([-DRAG_THRESHOLD, DRAG_THRESHOLD])
    .failOffsetY([-DRAG_THRESHOLD, DRAG_THRESHOLD])
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
  // a short tap without moving
  const tap = Gesture.Tap().onEnd((_event, success) => {
    if (success) applyImpulse(TAP_IMPULSE);
  });

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <View style={[{ width: windowWidth, height: size * VIEW_HEIGHT_RATIO }, style]}>
        {/* flat: no tone mapping, so the colors stay as defined in daruma_colors */}
        <Canvas flat camera={{ fov: FOV }}>
          <FitCamera size={size} />
          {/* no three.js lights: the toon material has its own light, see toon_settings.ts */}
          <Suspense fallback={null}>
            <Turntable speed={speed} dragging={dragging} tilt={tilt}>
              <DarumaModel color={color} leftEye={leftEye} rightEye={rightEye} />
            </Turntable>
          </Suspense>
        </Canvas>
      </View>
    </GestureDetector>
  );
}

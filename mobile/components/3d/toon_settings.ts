// Light and look of the 3D daruma (toon style: hard edges between light, shadow and highlight).
// Applies to the body and the writing; the face is not lit at all (shown exactly like daruma_face.png).
// All values are read when the material is created, so changes show up after a reload.
export const TOON_LIGHT = {
  // where the light comes from (x = right, y = up, z = towards the camera); only the direction counts, not the length
  direction: [1, 1, 0] as [number, number, number],

  // light side: brightness of the color where the light hits (1 = exactly the color from daruma_colors)
  litBrightness: 1,
  // shadow side: brightness of the color in the shadow (0 = black, 1 = no shadow)
  shadowBrightness: 0.5,
  // where the shadow starts: -1 = only the very back is in shadow, 0 = half/half, 1 = almost everything in shadow
  shadowThreshold: -0.4,
  // softness of the shadow edge (0 = razor sharp, 0.1 = soft)
  edgeSoftness: 0.01,

  // highlight (the white glossy spot): size (smaller number = bigger spot) and strength (0 = off, 1 = pure white)
  highlightSize: 20,
  highlightStrength: 0.2,
};

// Extra settings for the gold daruma: a second, brighter band and a bigger, colored highlight
export const TOON_GOLD = {
  // gold is a bit darker on the light side, so the bright band stands out
  litBrightness: 1.0,
  // brightness of the bright band (1 = base color)
  brightBand: 1.3,
  // where the bright band starts (like shadowThreshold, but higher = smaller band)
  brightBandThreshold: 0.5,
  // shadow brightness for gold (metal has darker shadows)
  shadowBrightness: 0.45,
  highlightSize: 15,
  highlightStrength: 1.2,
};

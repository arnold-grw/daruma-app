import { EYE_LAYOUT } from "@/components/daruma/daruma_display";
import { DARUMA_ASPECT } from "@/components/daruma/daruma_details";
import { getStrokeWidth, VIEWBOX_SIZE } from "@/components/drawing/drawing_renderer";
import { DrawingData } from "@/types/drawing";
import * as THREE from "three";

// pixels per side of one eye area (the eye area is about 225 px wide on the 1024 px face texture)
const RESOLUTION = 256;

/**
 * Where the eye areas sit on the face texture (UV 0..1, v from the top), the same places as in the 2D daruma.
 * The face texture has the same layout as the 2D artwork, so the 2D share values can be used directly.
 * The left eye is on the right side of the face as seen by the viewer, like in DarumaDisplay.
 */
export const EYE_UV = {
  leftCenter: new THREE.Vector2(0.5 + EYE_LAYOUT.xOffset, 0.5 - EYE_LAYOUT.yOffset),
  rightCenter: new THREE.Vector2(0.5 - EYE_LAYOUT.xOffset, 0.5 - EYE_LAYOUT.yOffset),
  // half the size of the square eye area; the artwork is a bit higher than wide, so it is a bit less in v
  halfSize: new THREE.Vector2(EYE_LAYOUT.size / 2, EYE_LAYOUT.size / 2 / DARUMA_ASPECT),
};

/**
 * Draws the strokes of one eye into one color channel of the pixels (0 = nothing, 255 = ink).
 * Every stroke piece is a line with round ends, so a pixel is ink where it is closer to the line than half the stroke width.
 */
function drawEye(pixels: Uint8Array, channel: number, drawing: DrawingData) {
  // drawing coordinates: -1..1, y up -> pixels: 0..RESOLUTION, y down
  const toPixelX = (x: number) => ((x + 1) / 2) * RESOLUTION;
  const toPixelY = (y: number) => ((1 - y) / 2) * RESOLUTION;

  for (const line of drawing.lines) {
    // stroke width is given in viewBox units, which span the whole eye area
    const radius = (getStrokeWidth(line.width) / VIEWBOX_SIZE) * RESOLUTION / 2;
    const points = line.points;
    // pieces from each point to the next; a line with a single point is a dot (a piece from the point to itself)
    for (let i = 0; i < Math.max(points.length - 1, 1) && points.length > 0; i++) {
      const next = points[Math.min(i + 1, points.length - 1)];
      const ax = toPixelX(points[i].x);
      const ay = toPixelY(points[i].y);
      const bx = toPixelX(next.x);
      const by = toPixelY(next.y);

      const dx = bx - ax;
      const dy = by - ay;
      const lengthSquared = dx * dx + dy * dy;
      // only the pixels around this piece
      const minX = Math.max(0, Math.floor(Math.min(ax, bx) - radius - 1));
      const maxX = Math.min(RESOLUTION - 1, Math.ceil(Math.max(ax, bx) + radius + 1));
      const minY = Math.max(0, Math.floor(Math.min(ay, by) - radius - 1));
      const maxY = Math.min(RESOLUTION - 1, Math.ceil(Math.max(ay, by) + radius + 1));

      for (let py = minY; py <= maxY; py++) {
        for (let px = minX; px <= maxX; px++) {
          // distance from the pixel center to the closest point of the piece
          const cx = px + 0.5 - ax;
          const cy = py + 0.5 - ay;
          const t = lengthSquared > 0 ? Math.max(0, Math.min(1, (cx * dx + cy * dy) / lengthSquared)) : 0;
          const distance = Math.hypot(cx - t * dx, cy - t * dy);
          // soft edge of one pixel against jagged lines
          const ink = Math.max(0, Math.min(1, radius - distance + 0.5));
          const index = (py * RESOLUTION + px) * 4 + channel;
          pixels[index] = Math.max(pixels[index], Math.round(ink * 255));
        }
      }
    }
  }
}

/**
 * Texture with both painted eyes: red channel = left eye, green channel = right eye.
 * Each channel covers one eye area (see EYE_UV); the shader places and colors them.
 */
export function createEyeTexture(leftEye?: DrawingData, rightEye?: DrawingData) {
  // no eyes painted: one empty pixel is enough
  const size = leftEye || rightEye ? RESOLUTION : 1;
  const pixels = new Uint8Array(size * size * 4);
  if (leftEye) drawEye(pixels, 0, leftEye);
  if (rightEye) drawEye(pixels, 1, rightEye);

  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

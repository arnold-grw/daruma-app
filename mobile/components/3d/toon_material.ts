import * as THREE from "three";
import { eyeColor } from "@/constants/daruma_colors";
import { EYE_UV } from "./eye_texture";
import { TOON_GOLD, TOON_LIGHT } from "./toon_settings";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize( mat3( modelMatrix ) * normal );
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 baseColor;
  uniform sampler2D faceMap;
  uniform sampler2D writingMap;
  uniform vec3 lightDirection;
  uniform float litBrightness;
  uniform float shadowBrightness;
  uniform float shadowThreshold;
  uniform float edgeSoftness;
  uniform float highlightSize;
  uniform float highlightStrength;
  uniform bool gold;
  uniform float brightBand;
  uniform float brightBandThreshold;
  uniform float dim;
  uniform float grayscale;
  uniform sampler2D eyeMap;
  uniform vec3 eyeColor;
  uniform vec2 leftEyeCenter;
  uniform vec2 rightEyeCenter;
  uniform vec2 eyeHalfSize;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // 0 below the threshold, 1 above, with a very short soft edge against jagged pixels
  float band( float value, float threshold ) {
    // (smoothstep needs two different edges, so the softness never reaches exactly 0)
    float softness = max( edgeSoftness, 0.0001 );
    return smoothstep( threshold - softness, threshold + softness, value );
  }

  // ink of one eye at this point: the eye texture is stretched over the eye area, 0 outside of it
  float eyeInk( vec2 center, vec4 channel ) {
    vec2 local = ( vUv - center ) / eyeHalfSize;
    // always sample, then mask: sampling only inside (an if) breaks the GPU's mipmap choice
    // at the edge of the area, which showed up as thin dark lines around the eyes
    float ink = dot( texture2D( eyeMap, local * 0.5 + 0.5 ), channel );
    float inside = step( abs( local.x ), 1.0 ) * step( abs( local.y ), 1.0 );
    return ink * inside;
  }

  void main() {
    // writing over the base color where it is opaque; both get the toon light
    vec4 writing = texture2D( writingMap, vUv );
    vec3 albedo = mix( baseColor, writing.rgb, writing.a );
    // gold only on the body, the writing stays matte
    float metal = gold ? 1.0 - writing.a : 0.0;

    vec3 normal = normalize( vNormal );
    vec3 light = normalize( lightDirection );
    vec3 view = normalize( cameraPosition - vWorldPosition );

    // light or shadow: two hard steps
    float lightAmount = dot( normal, light );
    float lit = band( lightAmount, shadowThreshold );
    float brightness = mix( shadowBrightness, litBrightness, lit );
    // gold gets a third, brighter step facing the light (on the writing too)
    brightness = mix( brightness, brightBand, ( gold ? 1.0 : 0.0 ) * band( lightAmount, brightBandThreshold ) );
    vec3 color = albedo * brightness;

    // highlight: a hard-edged spot where the light reflects towards the camera
    float shine = pow( max( dot( normal, normalize( light + view ) ), 0.0 ), highlightSize );
    float highlight = band( shine, 0.5 ) * lit * highlightStrength;
    // white on lacquer, light gold on metal
    vec3 highlightColor = mix( vec3( 1.0 ), mix( albedo, vec3( 1.0 ), 0.6 ), metal );
    color = mix( color, highlightColor, highlight );

    // face on top, without any light: exactly the colors of the texture
    vec4 face = texture2D( faceMap, vUv );
    color = mix( color, face.rgb, face.a );

    // painted eyes on the face, also without light (red channel = left eye, green = right eye)
    float eyes = max( eyeInk( leftEyeCenter, vec4( 1.0, 0.0, 0.0, 0.0 ) ), eyeInk( rightEyeCenter, vec4( 0.0, 1.0, 0.0, 0.0 ) ) );
    color = mix( color, eyeColor, eyes );

    // gray with the same brightness, e.g. for colors that are still locked (0 = normal, 1 = gray)
    color = mix( color, vec3( dot( color, vec3( 0.2126, 0.7152, 0.0722 ) ) ), grayscale );

    // darker as a whole, e.g. for darumas in the background (1 = normal)
    color *= dim;

    gl_FragColor = vec4( color, 1.0 );
    #include <colorspace_fragment>
  }
`;

/**
 * Toon material of the daruma: base color with the writing on top, both with hard edges between light and shadow
 * and a hard highlight; the face and the painted eyes (see eye_texture.ts) are drawn over it without light.
 * Settings in toon_settings.ts.
 */
export function createToonMaterial(
  faceTexture: THREE.Texture,
  writingTexture: THREE.Texture,
  eyeTexture: THREE.Texture,
  color: string,
  gold: boolean,
  grayscale = false
) {
  const settings = gold ? { ...TOON_LIGHT, ...TOON_GOLD } : TOON_LIGHT;
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      baseColor: { value: new THREE.Color(color) },
      faceMap: { value: faceTexture },
      writingMap: { value: writingTexture },
      lightDirection: { value: new THREE.Vector3(...TOON_LIGHT.direction) },
      litBrightness: { value: settings.litBrightness },
      shadowBrightness: { value: settings.shadowBrightness },
      shadowThreshold: { value: settings.shadowThreshold },
      edgeSoftness: { value: settings.edgeSoftness },
      highlightSize: { value: settings.highlightSize },
      highlightStrength: { value: settings.highlightStrength },
      gold: { value: gold },
      brightBand: { value: TOON_GOLD.brightBand },
      brightBandThreshold: { value: TOON_GOLD.brightBandThreshold },
      dim: { value: 1 },
      grayscale: { value: grayscale ? 1 : 0 },
      eyeMap: { value: eyeTexture },
      eyeColor: { value: new THREE.Color(eyeColor) },
      leftEyeCenter: { value: EYE_UV.leftCenter },
      rightEyeCenter: { value: EYE_UV.rightCenter },
      eyeHalfSize: { value: EYE_UV.halfSize },
    },
  });
}

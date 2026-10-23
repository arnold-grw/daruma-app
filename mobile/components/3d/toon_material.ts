import * as THREE from "three";
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

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  // 0 below the threshold, 1 above, with a very short soft edge against jagged pixels
  float band( float value, float threshold ) {
    // (smoothstep needs two different edges, so the softness never reaches exactly 0)
    float softness = max( edgeSoftness, 0.0001 );
    return smoothstep( threshold - softness, threshold + softness, value );
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

    gl_FragColor = vec4( color, 1.0 );
    #include <colorspace_fragment>
  }
`;

/**
 * Toon material of the daruma: base color with the writing on top, both with hard edges between light and shadow
 * and a hard highlight; the face is drawn over it without light. Settings in toon_settings.ts.
 */
export function createToonMaterial(faceTexture: THREE.Texture, writingTexture: THREE.Texture, color: string, gold: boolean) {
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
    },
  });
}

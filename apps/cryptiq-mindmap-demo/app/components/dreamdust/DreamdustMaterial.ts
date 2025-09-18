import { Matrix4, ShaderMaterial } from 'three'
import type { IUniform, ShaderMaterialParameters } from 'three'

import {
  DREAMDUST_DEPTH_FADE_CHUNK,
  DREAMDUST_INK_SAMPLE_CHUNK,
  DREAMDUST_NOISE_CHUNK,
  DREAMDUST_SOFT_SPRITE_CHUNK,
} from './glsl/chunks'

type UniformRecord = Record<string, IUniform>

type DreamdustMaterialOptions = {
  unproject: boolean
  vertexInkOk?: boolean
}

const FALLBACK_NUMBER_UNIFORMS: Record<string, number> = {
  uBaseSize: 4,
  uFocal: 600,
  uMinSize: 0.75,
  uMaxSize: 6.0,
  uDepthMin: 0,
  uDepthMax: 1,
  uGamma: 1,
  uInvertDepth: 0,
  uReveal: 1,
  uBreath: 0,
  uSizeGain: 0,
  uOffsetGain: 0,
  uDepthNormScale: 1e-3,
  uDepthBias: 0,
  uHasCapture: 0,
  uZNearNdc: -1,
  uZFarNdc: 1,
  uInkIntensity: 0,
  uTintGain: 0,
}

function ensureUniform(uniforms: UniformRecord, name: string, value: unknown) {
  if (uniforms[name] === undefined) {
    uniforms[name] = { value } as IUniform
  }
}

const VERTEX_SHADER = /* glsl */ `
precision highp float;

uniform float uBaseSize;
uniform float uFocal;
uniform float uMinSize;
uniform float uMaxSize;
uniform float uDepthMin;
uniform float uDepthMax;
uniform float uGamma;
uniform float uInvertDepth;
uniform float uReveal;
uniform float uBreath;
uniform float uSizeGain;
uniform float uOffsetGain;
uniform float uDepthNormScale;
uniform float uHasCapture;
uniform float uZNearNdc;
uniform float uZFarNdc;
uniform mat4 uPVInvCapture;
#ifdef USE_VERTEX_INK
uniform float uInkIntensity;
#endif

uniform sampler2D uInkTex;

attribute vec2 aUv;
attribute float aDepth;
attribute vec3 color;

varying vec3 vColor;
varying float vRevealMix;
varying vec3 vInkTint;
varying float vInkMix;
varying vec3 vPosMV;

${DREAMDUST_NOISE_CHUNK}
${DREAMDUST_INK_SAMPLE_CHUNK}

vec4 dreamdustUnproject(vec2 captureUv, float depth01) {
#ifdef USE_UNPROJECT
  if (uHasCapture > 0.5) {
    vec2 ndc = captureUv * 2.0 - 1.0;
    vec4 wNear = uPVInvCapture * vec4(ndc.x, ndc.y, uZNearNdc, 1.0);
    vec4 wFar = uPVInvCapture * vec4(ndc.x, ndc.y, uZFarNdc, 1.0);
    wNear.xyz /= max(1e-6, wNear.w);
    wFar.xyz /= max(1e-6, wFar.w);
    wNear.w = 1.0;
    wFar.w = 1.0;
    return mix(wNear, wFar, depth01);
  }
#endif
  return modelMatrix * vec4(position, 1.0);
}

void main() {
  float depthNorm = clamp((aDepth - uDepthMin) / max(1e-5, (uDepthMax - uDepthMin)), 0.0, 1.0);
  depthNorm = pow(depthNorm, max(uGamma, 1e-5));
  if (uInvertDepth > 0.5) {
    depthNorm = 1.0 - depthNorm;
  }

  vec4 worldPos = dreamdustUnproject(aUv, depthNorm);

  vec3 revealSeed = vec3(aUv * 173.0, depthNorm * 91.0 + 0.17);
  float reveal = clamp(uReveal, 0.0, 1.0);
  float jitter = dd_hash13(revealSeed);
  float revealNorm = clamp(reveal * 1.1 - jitter, 0.0, 1.0);
  float revealMix = revealNorm * revealNorm * (3.0 - 2.0 * revealNorm);

  vec3 mistDir = dd_hash33_signed(revealSeed + vec3(37.0, 11.0, 5.0));
  float mistRadius = mix(90.0, 6.0, revealMix);
  vec3 mistPos = worldPos.xyz + mistDir * (mistRadius + depthNorm * 20.0);
  vec3 finalPos = mix(mistPos, worldPos.xyz, revealMix);

  float breath = clamp(uBreath, -1.0, 1.0);
  float breathOffset = breath * uOffsetGain;
  finalPos.xy += mistDir.xy * breathOffset;

  vec4 viewPos = viewMatrix * vec4(finalPos, 1.0);
  float viewDist = max(1e-3, -viewPos.z);

  float atten = clamp(uFocal / viewDist, uMinSize, uMaxSize);
  float breathSize = 1.0 + breath * uSizeGain;
  float revealSize = mix(0.45, 1.0, revealMix);
  gl_PointSize = max(0.0, uBaseSize * atten * breathSize * revealSize);

  vColor = color;
  vRevealMix = revealMix;
  vPosMV = viewPos.xyz;

#ifdef USE_VERTEX_INK
  DreamdustInkSample dd_ink = dreamdustSampleInk(uInkTex, aUv);
  vInkTint = dd_ink.tint;
  vInkMix = dd_ink.intensity * uInkIntensity;
#else
  vInkTint = vec3(0.0);
  vInkMix = 0.0;
#endif

  gl_Position = projectionMatrix * viewPos;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uGamma;
uniform float uTintGain;
uniform float uDepthBias;
uniform float uDepthNormScale;

varying vec3 vColor;
varying float vRevealMix;
varying vec3 vInkTint;
varying float vInkMix;
varying vec3 vPosMV;

${DREAMDUST_SOFT_SPRITE_CHUNK}
${DREAMDUST_DEPTH_FADE_CHUNK}

void main() {
  float sprite = dreamdustSoftSprite(gl_PointCoord);
  if (sprite <= 0.0) {
    discard;
  }

  float alpha = pow(sprite, max(uGamma, 1e-3));
  alpha *= vRevealMix;

  float distNorm = clamp(-vPosMV.z * uDepthNormScale, 0.0, 10.0);
  alpha *= DD_DEPTH_ALPHA(distNorm, uDepthBias);

  if (alpha <= 1e-4) {
    discard;
  }

  float tintMix = clamp(vInkMix * uTintGain, 0.0, 1.0);
  vec3 color = vColor;
  if (tintMix > 1e-5) {
    color = mix(color, vInkTint, tintMix);
  }

  gl_FragColor = vec4(color, alpha);
}
`;

export function makeDreamdustMaterial(
  uniforms: UniformRecord,
  opts: DreamdustMaterialOptions,
) {
  const vertexInkOk = opts.vertexInkOk ?? false

  for (const [name, value] of Object.entries(FALLBACK_NUMBER_UNIFORMS)) {
    ensureUniform(uniforms, name, value)
  }

  ensureUniform(uniforms, 'uPVInvCapture', new Matrix4())
  ensureUniform(uniforms, 'uInkTex', null)

  const defines: ShaderMaterialParameters['defines'] = {}
  if (opts.unproject) {
    defines.USE_UNPROJECT = 1
  }
  if (vertexInkOk) {
    defines.USE_VERTEX_INK = 1
  }

  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    defines,
  })

  material.uniforms = uniforms
  material.defines = material.defines ?? {}

  if (opts.unproject) {
    material.defines.USE_UNPROJECT = 1
  } else {
    delete material.defines.USE_UNPROJECT
  }

  if (vertexInkOk) {
    material.defines.USE_VERTEX_INK = 1
  } else {
    delete material.defines.USE_VERTEX_INK
  }

  return material
}

/** @deprecated Use {@link makeDreamdustMaterial} instead. */
export const createDreamdustMaterial = makeDreamdustMaterial

export type { DreamdustMaterialOptions }

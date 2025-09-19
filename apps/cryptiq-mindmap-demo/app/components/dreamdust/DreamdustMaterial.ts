import { Matrix4, ShaderMaterial } from 'three'
import type { IUniform, ShaderMaterialParameters } from 'three'

import {
  DD_CURL3,
  DD_FBM3,
  DREAMDUST_COLOR_CHUNK,
  DREAMDUST_DEPTH_FADE_CHUNK,
  DREAMDUST_INK_SAMPLE_CHUNK,
  DREAMDUST_NOISE_CHUNK,
  DREAMDUST_SOFT_SPRITE_CHUNK,
} from './glsl/chunks'

type UniformRecord = Record<string, IUniform>

type DreamdustMaterialOptions = {
  unproject: boolean
  vertexInkOk: boolean
}

type DreamdustMaterialOptionsInput = {
  unproject: boolean
  vertexInkOk?: boolean
}

const DEFAULT_UNIFORM_VALUES = {
  uTime: 0,
  uReveal: 1,
  uBreath: 0.5,
  uNoiseScale: 1,
  uNoiseSpeed: 1,
  uNoiseThreshold: 1,
  uDriftAmp: 0,
  uCurlFreq: 1,
  uCurlAmp: 1,
  uDriftSpeed: 1,
  uTapGain: 0.5,
  uTapTau: 2,
  uPointBaseSize: 1,
  uFocal: 1,
  uMinSize: 1,
  uMaxSize: 1,
  uSizeGain: 1,
  uOffsetGain: 0,
  uInkIntensity: 1,
  uTintGain: 1,
  uDepthMin: 0,
  uDepthMax: 1,
  uGamma: 1,
  uRimGamma: 2,
  uDepthBias: 1.8,
  uDepthNormScale: 0.001,
  uHasCapture: 0,
  uZNearNdc: -0.85,
  uZFarNdc: 0.85,
  uPVInvCapture: new Matrix4(),
  uInkTex: null,
  uCascade: 0,
  uCascadeColor: [1, 1, 1] as [number, number, number],
  uCascadeSizeBoost: 0,
  uVaporGain: 0,
  uVertexInkOk: 0,
  uViewport: [1, 1] as [number, number],
} as const

type DefaultUniformKey = keyof typeof DEFAULT_UNIFORM_VALUES

function cloneUniformValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value]
  }
  if (value instanceof Matrix4) {
    return value.clone()
  }
  return value
}

function ensureUniform(uniforms: UniformRecord, name: DefaultUniformKey) {
  if (uniforms[name] === undefined) {
    const defaultValue = DEFAULT_UNIFORM_VALUES[name]
    uniforms[name] = { value: cloneUniformValue(defaultValue) } as IUniform
  }
}

function aliasUniform(
  uniforms: UniformRecord,
  legacyName: string,
  canonicalName: DefaultUniformKey,
) {
  const canonicalUniform = uniforms[canonicalName] as IUniform | undefined
  const legacyUniform = uniforms[legacyName] as IUniform | undefined

  if (legacyUniform && !canonicalUniform) {
    uniforms[canonicalName] = legacyUniform
    return
  }

  if (!legacyUniform && canonicalUniform) {
    uniforms[legacyName] = canonicalUniform
    return
  }

  if (legacyUniform && canonicalUniform && legacyUniform !== canonicalUniform) {
    uniforms[legacyName] = canonicalUniform
  }
}

function isTruthyDefine(value: unknown): boolean {
  if (typeof value === 'number') {
    return value !== 0
  }
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase()
    if (trimmed === '' || trimmed === '0' || trimmed === 'false') {
      return false
    }
    return true
  }
  return !!value
}

function syncLegacyVertexInkDefine(
  defines: ShaderMaterialParameters['defines'] | undefined,
) {
  if (!defines) {
    return
  }
  const record = defines as Record<string, unknown>
  if (!Object.prototype.hasOwnProperty.call(record, 'VERTEX_INK_OK')) {
    return
  }
  if (isTruthyDefine(record.VERTEX_INK_OK)) {
    record.USE_VERTEX_INK = 1
  } else {
    delete record.USE_VERTEX_INK
  }
}

const VERTEX_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uReveal;
uniform float uBreath;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uDriftAmp;
uniform float uCurlFreq;
uniform float uCurlAmp;
uniform float uDriftSpeed;
uniform float uTapGain;
uniform float uTapTau;
uniform float uPointBaseSize;
uniform float uFocal;
uniform float uMinSize;
uniform float uMaxSize;
uniform float uSizeGain;
uniform float uOffsetGain;
uniform float uInkIntensity;
uniform float uTintGain;
uniform float uDepthMin;
uniform float uDepthMax;
uniform float uGamma;
uniform float uDepthNormScale;
uniform float uVertexInkOk;
uniform float uCascade;
uniform float uCascadeSizeBoost;
uniform float uVaporGain;

uniform float uHasCapture;
uniform float uZNearNdc;
uniform float uZFarNdc;
uniform mat4 uPVInvCapture;

uniform sampler2D uInkTex;

attribute vec2 aUv;
attribute float aDepth;
attribute vec3 color;

varying vec3 vColor;
varying vec3 vInkTint;
varying float vInkMix;
varying vec2 vInkUv;
varying float vRevealMix;
varying vec2 vRevealCoord;
varying vec3 vPosMV;

${DREAMDUST_NOISE_CHUNK}
${DREAMDUST_INK_SAMPLE_CHUNK}
${DD_FBM3}
${DD_CURL3}

vec4 dreamdustUnproject(vec3 localPos, vec2 captureUv, float depth01) {
#ifdef USE_UNPROJECT
  if (uHasCapture > 0.5) {
    vec2 ndc = captureUv * 2.0 - 1.0;
    vec4 wNear = uPVInvCapture * vec4(ndc.x, ndc.y, uZNearNdc, 1.0);
    vec4 wFar = uPVInvCapture * vec4(ndc.x, ndc.y, uZFarNdc, 1.0);
    vec3 nearPos = wNear.xyz / max(1e-6, wNear.w);
    vec3 farPos = wFar.xyz / max(1e-6, wFar.w);
    return vec4(mix(nearPos, farPos, depth01), 1.0);
  }
#endif
  return modelMatrix * vec4(localPos, 1.0);
}

void main() {
  float depthSpan = max(1e-5, uDepthMax - uDepthMin);
  float depth01 = clamp((aDepth - uDepthMin) / depthSpan, 0.0, 1.0);
  depth01 = pow(depth01, max(uGamma, 1e-5));

  vec4 worldPos = dreamdustUnproject(position, aUv, depth01);
  vec3 basePos = worldPos.xyz;

  float revealProgress = clamp(uReveal, 0.0, 1.0);
  float revealSeed = dd_hash13(vec3(aUv * 37.0, aDepth * 19.0));
  float revealGate = smoothstep(revealSeed * 0.7, 1.0, revealProgress);

  vec3 jitterSeed = dd_hash33(vec3(aUv * 173.0, aDepth * 59.0));
  vec3 mistDir = jitterSeed * 2.0 - 1.0;
  mistDir = normalize(mistDir + vec3(1e-4));
  float mistAmount = (1.0 - revealGate) * 1.8 + 0.35;
  vec3 mistPos = basePos + mistDir * mistAmount;

  float breathPhase = (uBreath - 0.5) * 2.0;
  mistPos += mistDir * (breathPhase * 0.08);

  vec3 revealPos = mix(mistPos, basePos, revealGate);

  float tapImpulse = 0.0;
  vec2 inkSampleOffset = vec2(0.0);
  float inkSampleSwell = 0.0;
  vec3 inkSampleTint = vec3(0.0);
  float inkSampleIntensity = 0.0;

#ifdef USE_VERTEX_INK
  if (uInkIntensity > 1e-5 && uVertexInkOk > 0.5) {
    DreamdustInkSample inkSample = dreamdustSampleInk(uInkTex, aUv);
    float localIntensity = inkSample.intensity * uInkIntensity;
    if (localIntensity > 1e-5) {
      inkSampleOffset = inkSample.offset;
      inkSampleSwell = inkSample.swell;
      inkSampleTint = inkSample.tint;
      inkSampleIntensity = localIntensity;

      float tapPhase = clamp(inkSample.swell, 0.0, 1.0);
      float tapMix = tapPhase;
      if (uTapTau > 1e-3) {
        float baseDecay = exp(-uTapTau);
        float tapDecay = exp(-max(0.0, 1.0 - tapPhase) * uTapTau);
        float denom = max(1.0 - baseDecay, 1e-3);
        tapMix = clamp((tapDecay - baseDecay) / denom, 0.0, 1.0);
      }
      tapImpulse = tapMix * localIntensity * uTapGain;
    }
  }
#endif

  vec3 curlSample = revealPos * uCurlFreq + vec3(uTime * uDriftSpeed);
  float cascadeMix = clamp(uCascade, 0.0, 1.0);
  float vaporGain = max(uVaporGain, 0.0);
  float curlMix = (uDriftAmp + tapImpulse) * uCurlAmp;
  float curlBoost = mix(1.0, 4.0, cascadeMix);
  float vaporBoost = 1.0 + vaporGain * cascadeMix;
  curlMix *= curlBoost * vaporBoost;
  vec3 curlOffset = dd_curl3(curlSample) * curlMix;
  revealPos += curlOffset;

  if (cascadeMix > 1e-5) {
    vec3 vaporSample = curlSample * 0.75 + vec3(uTime * 0.21, uTime * 0.13, uTime * 0.07);
    vec3 vaporFlow = dd_fbm3Vec(vaporSample) - vec3(0.5);
    float vaporStrength = cascadeMix * (0.35 + vaporGain * 0.85);
    revealPos += vaporFlow * vaporStrength;
  }

  vec4 viewPos = viewMatrix * vec4(revealPos, 1.0);
  float viewDist = max(1e-3, -viewPos.z);
  float attenuation = clamp(uFocal / viewDist, uMinSize, uMaxSize);
  float breathScale = 1.0 + breathPhase * 0.12;
  float cascadeSize = mix(0.0, max(uCascadeSizeBoost, 0.0), cascadeMix);
  float pointSize = uPointBaseSize * attenuation * breathScale * (1.0 + cascadeSize);

  vec3 inkTint = vec3(0.0);
  float inkMix = 0.0;

#ifdef USE_VERTEX_INK
  if (inkSampleIntensity > 1e-5) {
    float pxScale = viewDist / max(1e-3, uFocal);
    vec2 inkOffset = inkSampleOffset * (inkSampleIntensity * uOffsetGain * pxScale);
    viewPos.xy += inkOffset;
    pointSize += inkSampleSwell * inkSampleIntensity * uSizeGain;
    inkTint = inkSampleTint;
    inkMix = inkSampleIntensity * uTintGain;
  }
#endif

  gl_PointSize = max(0.0, pointSize);

  float mistLift = mix(0.35, 1.0, revealGate);
  mistLift = clamp(max(mistLift, revealProgress * 0.9), 0.0, 1.0);

  vColor = color;
  vInkTint = inkTint;
  vInkMix = inkMix;
  vInkUv = aUv;
  vRevealMix = mistLift;
  vRevealCoord = aUv * (3.0 + uNoiseScale) + jitterSeed.xy;
  vPosMV = viewPos.xyz;

  gl_Position = projectionMatrix * viewPos;
}
`

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uNoiseSpeed;
uniform float uNoiseThreshold;
uniform float uInkIntensity;
uniform float uTintGain;
uniform float uDepthBias;
uniform float uDepthNormScale;
uniform float uGamma;
uniform float uRimGamma;
uniform float uCascade;
uniform vec3 uCascadeColor;

uniform sampler2D uInkTex;

varying vec3 vColor;
varying vec3 vInkTint;
varying float vInkMix;
varying vec2 vInkUv;
varying float vRevealMix;
varying vec2 vRevealCoord;
varying vec3 vPosMV;

${DREAMDUST_NOISE_CHUNK}
${DREAMDUST_SOFT_SPRITE_CHUNK}
${DREAMDUST_COLOR_CHUNK}
${DREAMDUST_INK_SAMPLE_CHUNK}
${DREAMDUST_DEPTH_FADE_CHUNK}

void main() {
  float sprite = dreamdustSoftSprite(gl_PointCoord);
  if (sprite <= 0.0) {
    discard;
  }

  float threshold = clamp(uNoiseThreshold, 0.0, 1.0);
  vec2 revealSample = vRevealCoord + vec2(uTime * 0.18 * uNoiseSpeed, uTime * 0.05);
  float revealNoise = dd_noise2(revealSample);
  float revealStrength = clamp(vRevealMix, 0.0, 1.0);
  float flow = revealNoise + revealStrength * (1.0 - threshold * 0.5);
  float baseReveal = smoothstep(threshold - 0.2, 1.0, flow);
  float revealAlpha = max(baseReveal, revealStrength * 0.35);

  float alpha = sprite * revealAlpha * revealStrength;
  float depthNorm = dreamdustViewDepthNorm(vPosMV, uDepthNormScale);
  alpha *= dreamdustDepthAlpha(depthNorm, uDepthBias);
  if (alpha <= 0.001) {
    discard;
  }

  vec3 color = vColor;

#ifdef USE_VERTEX_INK
  if (vInkMix > 1e-5) {
    color = dreamdustApplyInkTint(color, vInkTint, vInkMix);
  }
#else
  if (uInkIntensity > 1e-5) {
    DreamdustInkSample fragInk = dreamdustSampleInk(uInkTex, vInkUv);
    float localIntensity = fragInk.intensity * uInkIntensity;
    if (localIntensity > 1e-5) {
      float tintMix = localIntensity * uTintGain;
      if (tintMix > 1e-5) {
        color = dreamdustApplyInkTint(color, fragInk.tint, tintMix);
      }
      alpha *= clamp(localIntensity, 0.0, 1.0);
    }
  }
#endif

  vec3 baseRgb = color;
  if (uCascade > 0.0) {
    float cascadeMix = clamp(uCascade, 0.0, 1.0);
    float cascadeStrength = smoothstep(0.0, 1.0, pow(cascadeMix, 0.7));
    color = mix(baseRgb, uCascadeColor, cascadeStrength);
  }

  float pointShape = clamp(1.0 - sprite, 0.0, 1.0);
  float rim = pow(pointShape, max(uRimGamma, 1e-3));
  color = mix(color, vec3(1.0), rim * 0.2);
  alpha *= mix(1.0, 0.9, rim);

  color = dreamdustApplyGamma(color, uGamma);

  gl_FragColor = vec4(color, alpha);
}
`

export function makeDreamdustMaterial(
  uniforms: UniformRecord,
  opts: DreamdustMaterialOptions | DreamdustMaterialOptionsInput,
) {
  aliasUniform(uniforms, 'uBaseSize', 'uPointBaseSize')
  const uniformNames = Object.keys(DEFAULT_UNIFORM_VALUES) as DefaultUniformKey[]
  for (const name of uniformNames) {
    ensureUniform(uniforms, name)
  }
  aliasUniform(uniforms, 'uBaseSize', 'uPointBaseSize')

  const resolved: DreamdustMaterialOptions = {
    unproject: opts.unproject,
    vertexInkOk: opts.vertexInkOk ?? false,
  }

  const defines: ShaderMaterialParameters['defines'] = {}
  if (resolved.unproject) {
    defines.USE_UNPROJECT = 1
  }
  if (resolved.vertexInkOk) {
    defines.USE_VERTEX_INK = 1
    defines.VERTEX_INK_OK = 1
  }
  syncLegacyVertexInkDefine(defines)

  const params: ShaderMaterialParameters = {
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    defines,
  }

  const material = new ShaderMaterial(params)
  material.uniforms = uniforms
  material.defines = material.defines ?? {}
  syncLegacyVertexInkDefine(material.defines)
  if (resolved.unproject) {
    material.defines.USE_UNPROJECT = 1
  } else {
    delete material.defines.USE_UNPROJECT
  }
  if (resolved.vertexInkOk) {
    material.defines.USE_VERTEX_INK = 1
    material.defines.VERTEX_INK_OK = 1
  } else {
    delete material.defines.USE_VERTEX_INK
    delete material.defines.VERTEX_INK_OK
  }

  if (uniforms.uVertexInkOk) {
    uniforms.uVertexInkOk.value = resolved.vertexInkOk ? 1 : 0
  }

  const originalOnBeforeCompile = material.onBeforeCompile?.bind(material)
  material.onBeforeCompile = function onBeforeCompile(shader, renderer) {
    syncLegacyVertexInkDefine(material.defines)
    if (originalOnBeforeCompile) {
      originalOnBeforeCompile(shader, renderer)
    }
  }

  return material
}

/**
 * @deprecated use {@link makeDreamdustMaterial} instead.
 */
export const createDreamdustMaterial = makeDreamdustMaterial

export type { DreamdustMaterialOptions }

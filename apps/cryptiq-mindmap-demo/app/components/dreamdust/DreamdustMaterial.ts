import { ShaderMaterial } from 'three'
import type { IUniform, ShaderMaterialParameters } from 'three'

import {
  DREAMDUST_COLOR_CHUNK,
  DREAMDUST_DRIFT_CHUNK,
  DREAMDUST_INK_SAMPLE_CHUNK,
  DREAMDUST_NOISE_CHUNK,
  DREAMDUST_POINT_SHAPE_CHUNK,
  DREAMDUST_DEPTH_FADE_CHUNK,
} from './glsl/chunks'

type UniformRecord = Record<string, IUniform>

type DreamdustMaterialOptions = {
  unproject: boolean
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
uniform float uTime;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uDriftAmp;
uniform float uInkIntensity;
uniform float uInkOffsetGain;
uniform float uInkSizeGain;
uniform float uInkTintGain;
uniform float uVertexInkOk;
uniform float uHasCapture;
uniform float uZNearNdc;
uniform float uZFarNdc;
uniform mat4 uPVInvCapture;

uniform sampler2D uInkTex;

attribute vec2 aUv;
attribute float aDepth;
attribute vec3 color;

varying vec3 vColor;
varying vec3 vNoiseCoord;
varying vec3 vInkTint;
varying float vInkMix;
varying vec2 vInkUv;
varying vec3 vPosMV;

${DREAMDUST_NOISE_CHUNK}
${DREAMDUST_DRIFT_CHUNK}
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
  depthNorm = pow(depthNorm, uGamma);
  if (uInvertDepth > 0.5) {
    depthNorm = 1.0 - depthNorm;
  }

  vec4 worldPos = dreamdustUnproject(aUv, depthNorm);
  worldPos.xyz += dreamdustDrift(worldPos.xyz, uTime, uNoiseScale, uNoiseSpeed, uDriftAmp);

  vec4 viewPos = viewMatrix * worldPos;
  float viewDist = max(1e-3, -viewPos.z);

  vec3 inkTint = vec3(0.0);
  float inkMix = 0.0;
  float inkSizeBoost = 0.0;
  if (uVertexInkOk > 0.5 && uInkIntensity > 0.0) {
    DreamdustInkSample inkSample = dreamdustSampleInk(uInkTex, aUv);
    float localIntensity = inkSample.intensity * uInkIntensity;
    if (localIntensity > 1e-5) {
      float pxScale = viewDist / max(1e-3, uFocal);
      vec2 offsetView = inkSample.offset * (uInkOffsetGain * localIntensity * pxScale);
      viewPos.xy += offsetView;
      inkSizeBoost = inkSample.swell * localIntensity * uInkSizeGain;
      inkTint = inkSample.tint;
      inkMix = localIntensity * uInkTintGain;
    }
  }

  float atten = clamp(uFocal / viewDist, uMinSize, uMaxSize);
  gl_PointSize = max(0.0, uBaseSize * atten + inkSizeBoost);

  vColor = color;
  vNoiseCoord = worldPos.xyz * uNoiseScale;
  vInkTint = inkTint;
  vInkMix = inkMix;
  vInkUv = aUv;
  vPosMV = viewPos.xyz;

  gl_Position = projectionMatrix * viewPos;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uNoiseSpeed;
uniform float uNoiseThreshold;
uniform float uInkIntensity;
uniform float uInkTintGain;
uniform float uVertexInkOk;
uniform float uDepthBias;
uniform float uDepthNormScale;

uniform sampler2D uInkTex;

varying vec3 vColor;
varying vec3 vNoiseCoord;
varying vec3 vInkTint;
varying float vInkMix;
varying vec2 vInkUv;
varying vec3 vPosMV;

${DREAMDUST_NOISE_CHUNK}
${DREAMDUST_POINT_SHAPE_CHUNK}
${DREAMDUST_COLOR_CHUNK}
${DREAMDUST_INK_SAMPLE_CHUNK}
${DREAMDUST_DEPTH_FADE_CHUNK}

void main() {
  float shape = dreamdustPointShape(gl_PointCoord);
  if (shape <= 0.0) {
    discard;
  }

  vec3 posMV = vPosMV;
  float distNorm = clamp(-posMV.z * uDepthNormScale, 0.0, 10.0);

  vec2 revealCoord = vec2(vNoiseCoord.x + uTime * uNoiseSpeed, vNoiseCoord.y);
  if (dd_noise2(revealCoord) < uNoiseThreshold) {
    discard;
  }

  float alpha = shape;
  alpha *= DD_DEPTH_ALPHA(distNorm, uDepthBias);
  if (alpha <= 0.0) {
    discard;
  }

  vec3 color = vColor;
  if (vInkMix > 1e-5) {
    color = dreamdustApplyInkTint(color, vInkTint, vInkMix);
  }

  if (uVertexInkOk <= 0.5 && uInkIntensity > 0.0) {
    DreamdustInkSample fragInk = dreamdustSampleInk(uInkTex, vInkUv);
    float localIntensity = fragInk.intensity * uInkIntensity;
    if (localIntensity > 1e-5) {
      float tintMix = localIntensity * uInkTintGain;
      if (tintMix > 1e-5) {
        color = dreamdustApplyInkTint(color, fragInk.tint, tintMix);
      }
      alpha *= clamp(localIntensity, 0.0, 1.0);
    }
  }

  gl_FragColor = vec4(color, alpha);
}
`;

export function createDreamdustMaterial(
  uniforms: UniformRecord,
  opts: DreamdustMaterialOptions
) {
  if (uniforms.uDepthNormScale === undefined) {
    uniforms.uDepthNormScale = { value: 1 } as IUniform
  }

  const defines: ShaderMaterialParameters['defines'] = opts.unproject
    ? { USE_UNPROJECT: 1 }
    : {}

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
  if (opts.unproject) {
    material.defines.USE_UNPROJECT = 1
  } else {
    delete material.defines.USE_UNPROJECT
  }
  return material
}

export type { DreamdustMaterialOptions }

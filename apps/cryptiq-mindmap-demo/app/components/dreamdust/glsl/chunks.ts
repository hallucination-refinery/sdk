export const DREAMDUST_NOISE_CHUNK = /* glsl */ `
float dreamdustHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z + 1.0));
}

float dreamdustNoise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = dreamdustHash(i + vec3(0.0, 0.0, 0.0));
  float n100 = dreamdustHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = dreamdustHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = dreamdustHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = dreamdustHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = dreamdustHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = dreamdustHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = dreamdustHash(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);

  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

float dreamdustFbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += dreamdustNoise3d(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
`;

export const DREAMDUST_DRIFT_CHUNK = /* glsl */ `
vec3 dreamdustDrift(vec3 pos, float time, float scale, float speed, float amp) {
  vec3 base = pos * scale + vec3(0.0, 0.0, time * speed);
  float nx = dreamdustFbm(base + vec3(37.2, 11.8, 5.4));
  float ny = dreamdustFbm(base + vec3(5.3, 27.1, 19.7));
  float nz = dreamdustFbm(base + vec3(11.1, 41.3, 7.9));
  vec3 dir = vec3(nx, ny, nz) * 2.0 - 1.0;
  float len = max(1e-3, length(dir));
  dir /= len;
  return dir * amp;
}
`;

export const DREAMDUST_INK_SAMPLE_CHUNK = /* glsl */ `
struct DreamdustInkSample {
  vec2 offset;
  float swell;
  float intensity;
  vec3 tint;
};

DreamdustInkSample dreamdustSampleInk(sampler2D tex, vec2 uv) {
  vec4 ink = texture2D(tex, uv);
  DreamdustInkSample sample;
  sample.offset = ink.rg * 2.0 - 1.0;
  sample.swell = ink.b;
  sample.intensity = ink.a;
  sample.tint = ink.rgb;
  return sample;
}
`;

export const DREAMDUST_DEPTH_FADE_CHUNK = /* glsl */ `
float dreamdustDepthFade(float viewDist, float bias) {
  if (bias <= 0.0) {
    return 1.0;
  }
  return clamp(exp(-viewDist * bias), 0.0, 1.0);
}
`;

export const DREAMDUST_POINT_SHAPE_CHUNK = /* glsl */ `
float dreamdustPointShape(vec2 coord) {
  vec2 delta = coord * 2.0 - 1.0;
  float r2 = dot(delta, delta);
  float core = smoothstep(1.0, 0.0, r2);
  float feather = smoothstep(1.0, 0.6, r2);
  return core * feather;
}
`;

export const DREAMDUST_COLOR_CHUNK = /* glsl */ `
vec3 dreamdustApplyInkTint(vec3 baseColor, vec3 tintColor, float amount) {
  float mixAmt = clamp(amount, 0.0, 1.0);
  vec3 tinted = baseColor + tintColor * mixAmt;
  return mix(baseColor, tinted, mixAmt);
}
`;

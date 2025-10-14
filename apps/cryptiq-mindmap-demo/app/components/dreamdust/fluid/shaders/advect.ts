export const ADVECT_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

in vec2 vUv;
out vec4 outColor;

vec2 sampleVelocity(vec2 uv) {
  return texture(uVelocity, uv).xy;
}

void main() {
  vec2 velocity = sampleVelocity(vUv);
  vec2 backtrace = vUv - velocity * uDt;
  vec2 innerMin = uTexelSize * 0.5;
  vec2 innerMax = vec2(1.0) - innerMin;
  vec2 sampleUv = clamp(backtrace, innerMin, innerMax);
  vec2 advected = sampleVelocity(sampleUv);
  outColor = vec4(advected * uDissipation, 0.0, 1.0);
}
`


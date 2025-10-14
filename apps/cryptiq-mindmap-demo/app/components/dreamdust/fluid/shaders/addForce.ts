export const ADD_FORCE_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uPoint;
uniform float uRadius;
uniform float uStrength;

in vec2 vUv;
out vec4 outColor;

float gaussian(float x, float sigma) {
  float denom = max(1e-6, 2.0 * sigma * sigma);
  return exp(-(x * x) / denom);
}

void main() {
  vec2 offset = vUv - uPoint;
  float dist = length(offset);
  vec2 velocity = texture(uVelocity, vUv).xy;
  if (uRadius <= 1e-6 || uStrength <= 1e-6) {
    outColor = vec4(velocity, 0.0, 1.0);
    return;
  }
  float sigma = uRadius * 0.6;
  float falloff = gaussian(dist, sigma);
  vec2 dir = dist > 1e-6 ? offset / dist : vec2(0.0);
  velocity += dir * (uStrength * falloff);
  outColor = vec4(velocity, 0.0, 1.0);
}
`


export const PROJECT_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;

uniform sampler2D uVelocity;
uniform sampler2D uPressure;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 outColor;

float pressure(vec2 uv) {
  return texture(uPressure, uv).x;
}

void main() {
  vec2 tx = vec2(uTexelSize.x, 0.0);
  vec2 ty = vec2(0.0, uTexelSize.y);

  vec2 vel = texture(uVelocity, vUv).xy;
  float pressureL = pressure(vUv - tx);
  float pressureR = pressure(vUv + tx);
  float pressureB = pressure(vUv - ty);
  float pressureT = pressure(vUv + ty);

  vec2 gradient = vec2(pressureR - pressureL, pressureT - pressureB) * 0.5;
  vel -= gradient;
  outColor = vec4(vel, 0.0, 1.0);
}
`


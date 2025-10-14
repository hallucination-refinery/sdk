export const JACOBI_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 outColor;

float samplePressure(vec2 uv) {
  return texture(uPressure, uv).x;
}

void main() {
  vec2 tx = vec2(uTexelSize.x, 0.0);
  vec2 ty = vec2(0.0, uTexelSize.y);

  float left = samplePressure(vUv - tx);
  float right = samplePressure(vUv + tx);
  float bottom = samplePressure(vUv - ty);
  float top = samplePressure(vUv + ty);
  float divergence = texture(uDivergence, vUv).x;

  float pressure = 0.25 * (left + right + bottom + top - divergence);
  outColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`


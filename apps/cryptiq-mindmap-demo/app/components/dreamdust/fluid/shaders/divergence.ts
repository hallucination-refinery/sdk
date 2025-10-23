export const DIVERGENCE_SHADER = /* glsl */ String.raw`
precision highp float;

uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

in vec2 vUv;
out vec4 outColor;

vec2 velocity(vec2 uv) {
  return texture(uVelocity, uv).xy;
}

void main() {
  vec2 tx = vec2(uTexelSize.x, 0.0);
  vec2 ty = vec2(0.0, uTexelSize.y);

  float vxL = velocity(vUv - tx).x;
  float vxR = velocity(vUv + tx).x;
  float vyB = velocity(vUv - ty).y;
  float vyT = velocity(vUv + ty).y;

  float divergence = 0.5 * ((vxR - vxL) + (vyT - vyB));
  outColor = vec4(divergence, 0.0, 0.0, 1.0);
}
`


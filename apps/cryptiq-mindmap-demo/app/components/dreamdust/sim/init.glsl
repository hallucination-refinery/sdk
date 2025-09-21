#version 300 es
precision highp float;
uniform float uSeed,uCount; uniform vec2 uTexSize; uniform sampler2D uSceneColor;
layout(location=0) out vec4 oPos; layout(location=1) out vec4 oVel; layout(location=2) out vec4 oColor;
float hash(float h){return fract(sin(h)*43758.5453123);} vec3 rand3(float h){return vec3(hash(h),hash(h+1.7),hash(h+3.4));}
void main(){
  vec2 coord=gl_FragCoord.xy-0.5; float id=coord.y*uTexSize.x+coord.x;
  if(id>=uCount){oPos=oVel=oColor=vec4(0.0);return;}
  float a=hash(id+uSeed)*6.28318; float r=sqrt(hash(id+uSeed+0.5))*0.5; vec2 disk=vec2(cos(a),sin(a))*r;
  vec3 pos=vec3(disk.x,hash(id+uSeed+1.1)*0.12,disk.y);
  vec3 vel=normalize(vec3(disk.x,0.2,disk.y)+vec3(0.0,0.5,0.0))*mix(0.1,0.35,hash(id+uSeed+2.3));
  vel+=(rand3(id+uSeed+9.9)-0.5)*0.03;
  oPos=vec4(pos,1.0); oVel=vec4(vel,0.0); oColor=texture(uSceneColor,(coord+0.5)/uTexSize);
}

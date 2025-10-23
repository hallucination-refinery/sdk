#version 300 es
precision highp float;
uniform float uSeed,uCount; uniform vec2 uTexSize; uniform sampler2D uSpawnPos; uniform sampler2D uSpawnColor; uniform float uSpawnHasColor; uniform float uSpawnMode;
layout(location=0) out vec4 oPos; layout(location=1) out vec4 oVel; layout(location=2) out vec4 oColor;
float hash(float h){return fract(sin(h)*43758.5453123);} vec3 rand3(float h){return vec3(hash(h),hash(h+1.7),hash(h+3.4));}
vec4 fallbackColor(){return vec4(0.85,0.88,1.0,1.0);} 
void main(){
  vec2 coord=gl_FragCoord.xy-0.5; float id=coord.y*uTexSize.x+coord.x;
  if(id>=uCount){oPos=oVel=oColor=vec4(0.0);return;}
  vec2 uv=(coord+0.5)/uTexSize;
  vec4 posSample=texture(uSpawnPos,uv);
  float a=hash(id+uSeed)*6.28318; float r=sqrt(hash(id+uSeed+0.5))*0.5; vec2 disk=vec2(cos(a),sin(a))*r;
  vec3 vel=normalize(vec3(disk.x,0.2,disk.y)+vec3(0.0,0.5,0.0))*mix(0.1,0.35,hash(id+uSeed+2.3));
  vel+=(rand3(id+uSeed+9.9)-0.5)*0.03;
  if(uSpawnMode>0.5){
    float depth01=clamp(posSample.w,0.0,1.0);
    vec4 color= fallbackColor();
    if(uSpawnHasColor>0.5){color=texture(uSpawnColor,uv); color.a=1.0;}
    oPos=vec4(posSample.xyz,depth01);
    oVel=vec4(vel,0.0);
    oColor=color;
  }else{
    vec3 pos=vec3(disk.x,hash(id+uSeed+1.1)*0.12,disk.y);
    oPos=vec4(pos,1.0);
    oVel=vec4(vel,0.0);
    oColor=fallbackColor();
  }
}

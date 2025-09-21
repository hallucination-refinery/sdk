#version 300 es
precision highp float;
uniform sampler2D uPrevPos,uPrevVel; uniform vec2 uTexSize; uniform float uCount,uDt,uDamping,uFloorY,uTimeLow; uniform vec3 uGravity,uBoundsMin,uBoundsMax;
layout(location=0) out vec4 oPos; layout(location=1) out vec4 oVel;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);} vec3 curl(vec3 p,float t){vec3 a=vec3(hash(p+vec3(t,0.0,4.0)),hash(p+vec3(2.0,t,1.0)),hash(p+vec3(5.0,3.0,t)));vec3 b=vec3(hash(p+vec3(1.3,2.7,t+3.1)),hash(p+vec3(t+4.2,1.9,2.5)),hash(p+vec3(3.7,t+2.2,5.4)));return vec3(a.y-b.z,a.z-b.x,a.x-b.y);}
void main(){ vec2 coord=gl_FragCoord.xy-0.5; float id=coord.y*uTexSize.x+coord.x; if(id>=uCount){oPos=oVel=vec4(0.0);return;}
  vec2 uv=(coord+0.5)/uTexSize; vec3 pos=texture(uPrevPos,uv).xyz; vec3 vel=texture(uPrevVel,uv).xyz;
  vec3 force=uGravity+curl(pos,uTimeLow); vel=vel*(1.0-uDamping)+force*uDt; pos+=vel*uDt;
  if(pos.y<uFloorY){pos.y=uFloorY; if(vel.y<0.0) vel.y=-vel.y*(1.0-uDamping);} pos=clamp(pos,uBoundsMin,uBoundsMax);
  oPos=vec4(pos,1.0); oVel=vec4(vel,0.0); }

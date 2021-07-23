uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vPos;
varying vec2 vCoordinates;

uniform sampler2D t1;
uniform sampler2D t2;
uniform float size;
uniform float move;
uniform float progress;

attribute float aSpeed;
attribute float aOffset;
attribute vec3 aCoordinates;

void main(){
    vUv = uv;
    vec3 pos = position;    
    pos.x += sin(time * aSpeed / 10.0) * (1.0 - progress) * 3.0;
    pos.y += sin(time * aSpeed / 10.0) * (1.0 - progress) * 3.0;
    pos.z  = position.z + 1000.0 * (aSpeed - aSpeed * progress) + 10.0 + 10.0 * sin(position.x / 100.0 + time * 0.01);
    vec4 vPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = 2000. * (1. / -vPosition.z);
    gl_Position = projectionMatrix * vPosition;
    vPos = pos;
    vCoordinates = aCoordinates.xy;
}
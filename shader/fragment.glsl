varying vec2 vUv;
varying vec4 vPosition;
varying vec3 vPos;

varying vec2 vCoordinates;
uniform sampler2D t;

uniform sampler2D mask;
uniform float size;

void main(){
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    vec2 myUv = vec2(vCoordinates.x / size, vCoordinates.y / size);
    vec4 image = texture2D(t, myUv);
    
    float alpha = 1.0 - clamp(0., 1., abs(vPos.z / 400.0));

    gl_FragColor = image * (maskTexture.a) * alpha;
    // gl_FragColor = vec4(alpha);
}
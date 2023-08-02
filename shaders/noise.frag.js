export default `
precision mediump float;
uniform float time;

const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 
float gold_noise(in vec2 xy, in float seed)
{
   return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
    vec2 xy = gl_FragCoord.xy;
    float seed = fract(time); // fractional base seed

    vec3 rcol = vec3 (gold_noise(xy, seed+0.1),
                      0.8*gold_noise(xy, seed+0.2),
                      min(0.08, 0.5*gold_noise(xy, seed+0.3)));

    gl_FragColor = vec4 (hsl2rgb(rcol), 1.0);

}
`;
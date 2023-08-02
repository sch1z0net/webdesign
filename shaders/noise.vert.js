export default `
attribute vec2 pos;
//uniform float pointSize;
void main() {
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    //gl_PointSize = 1;//pointSize;
} 
`;
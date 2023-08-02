export default `
precision mediump float;

varying vec4 fcolor;

void main() {
    gl_FragColor = fcolor;
    //gl_FragColor = vec4 (1.0, 1.0, 1.0, 0.05);
}
`;
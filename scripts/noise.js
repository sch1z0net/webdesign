import sv_noise from '../shaders/noise.vert.js';
import sf_noise from '../shaders/noise.frag.js';
import { Webgl } from '../scripts/webgl.js';

"use strict";

var canvas = document.getElementById("bgnoise");
document.body.appendChild( canvas );

var noise = new Webgl(canvas, null, 100, 100, true, false);
var gl = noise.gl;

var counter = 0;
var fraction = 0;
var timer = 0;
var render = function() {
        gl.viewport(0,0, noise.viewport_w,noise.viewport_h);
        gl.clearColor(0,0,0, 1);
        gl.clear( gl.COLOR_BUFFER_BIT );
        testDraw();
        gl.flush();
        ++noise.info.frame;
        timer--;
        if(timer<=0){
            timer = 4;
            counter = (counter+1)%1000;
            fraction = counter/1000;
        }
        requestAnimationFrame(render);
};

    var loadShaders = function() {
        var sf = noise.loadShader(sf_noise, "frag");
        var sv = noise.loadShader(sv_noise, "vert");
        scene.program = noise.createProgram('program1', sv, sf);
    };

    var testDraw = function() {
        gl.useProgram( scene.program.program );
        gl.enableVertexAttribArray( scene.posLoc );
        gl.bindBuffer( gl.ARRAY_BUFFER, scene.posBuf );

        gl.uniform1f(scene.timeLoc, fraction);
        //gl.uniform1f(scene.timeLoc, info.frame);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    var prepareGeometry = function() {
        gl.useProgram( scene.program.program );
    // *** attrib ***
    // pos
        scene.pos = new Float32Array([
            -1,-1,
            1,-1,
            1, 1,
            1, 1,
            -1, 1,
            -1,-1,
            ]);
        scene.posLoc = gl.getAttribLocation(scene.program.program, 'pos');
        scene.posBuf = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, scene.posBuf );
        gl.bufferData( gl.ARRAY_BUFFER, scene.pos, gl.DYNAMIC_DRAW );
        gl.vertexAttribPointer(scene.posLoc, 2, gl.FLOAT, false, 2*4,0);
    // *** uniform ***
    // time
        scene.timeLoc = gl.getUniformLocation(scene.program.program, 'time');
    //error(gl.getError());
    };

    var scene = {};
    loadShaders();
    prepareGeometry();
    render();


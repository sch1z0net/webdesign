import { LineShading } from '../scripts/lines.js';
import { Webgl } from '../scripts/webgl.js';
import * as LA from '../scripts/linalg.js';
import { TrackballRotator } from '../scripts/trackball.js';

"use strict";
$(document).ready(function(){
    var color = [0.0,0.0,0.0];          // DNA COLOR

    var canvas = document.getElementById("dna");

    var context = new Webgl(canvas, null, 20, 75, true, false);
    var rotator = new TrackballRotator(context, render_, null, 10);
    var ls = new LineShading(context, 0.01);

    let rotspeed = 0.005;
    let mrot = 0;
    var render_ = function() {
        ls.gl_.viewport(0, 0, context.viewport_w, context.viewport_h);
        ls.gl_.clearColor(1,1,1,1);
        ls.gl_.clear( ls.gl_.COLOR_BUFFER_BIT ); 

        ls.modelmatrix   = LA.m4.yRotation(mrot)
        ls.getViewMatrix = LA.m4.identity();
        ls.projection    = rotator.getProjMatrix();
        ls.uniforms_(ls.scene_); 

        mrot += rotspeed;

        ls.draws_(ls.scene_);
        ls.gl_.flush();
        requestAnimationFrame(render_);
    };

    var abs_y_shift = 0;
    var ladder_offset = 50;
    var y_stretch = 0.002;
    var size = 5000;
    var ladder_distance = 70;

    var start_y = -size/2;
    var stop_y = size/2;
    var screwGeometry = function(radians_offset) { 
        var screw = [];
        for(var i = start_y; i<stop_y; i++){
          var c1A = Math.cos(i*0.005+radians_offset);
          var s1A = Math.sin(i*0.005+radians_offset);
          var t1A = y_stretch*i+abs_y_shift;
          screw.push(c1A);
          screw.push(t1A);
          screw.push(s1A);
          var c1B = Math.cos((i+1)*0.005+radians_offset);
          var s1B = Math.sin((i+1)*0.005+radians_offset);
          var t1B = y_stretch*(i+1)+abs_y_shift;
          screw.push(c1B);
          screw.push(t1B);
          screw.push(s1B);
        }

        return screw;
    }

    var ladderGeometry = function(i, radians_offset){
        var data = [];
        var c1 = Math.cos(i*0.005);
        var s1 = Math.sin(i*0.005);
        var t1 = y_stretch*i+abs_y_shift;
        var c2 = Math.cos((i+ladder_offset)*0.005+radians_offset);
        var s2 = Math.sin((i+ladder_offset)*0.005+radians_offset);
        var t2 = y_stretch*(i+ladder_offset)+abs_y_shift;
        data.push(c1+(c2-c1)*0);
        data.push(t1+(t2-t1)*0);
        data.push(s1+(s2-s1)*0);
        data.push(c1+(c2-c1)*0.5);
        data.push(t1+(t2-t1)*0.5);
        data.push(s1+(s2-s1)*0.5);
        data.push(c1+(c2-c1)*1);
        data.push(t1+(t2-t1)*1);
        data.push(s1+(s2-s1)*1);
        return data;
    }



    ls.addLineMesh_(ls.scene_, screwGeometry(1), color, 1);
    ls.addLineMesh_(ls.scene_, screwGeometry(0), color, 1);
    for(var i = start_y; i<stop_y; i+=ladder_distance){
       ls.addLineMesh_(ls.scene_, ladderGeometry(i,1), color, 1);
    }
    ls.fillBuffers_(ls.scene_);


    render_();


    var slider1 = document.getElementById("range1");
    var slider2 = document.getElementById("range2");

    slider1.oninput = function() { ls.thickness = (slider1.value / 100)*0.08+0.01; } 
    slider2.oninput = function() { rotspeed = ((slider2.value / 100)*0.1) - 0.05; } 


});
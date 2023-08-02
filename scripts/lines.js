import sv_lines from '../shaders/line2.vert.js';
import sf_lines from '../shaders/line2.frag.js';
import * as LA from '../sripts/linalg.js';

"use strict";

export class LineShading {

    constructor(context, thickness = 0.01, miter = 0) {
        this.thickness = thickness;
        this.miter = miter;

        this.context = context;
        this.gl_ = context.gl;
        this.canvas_ = context.canvas;
        this.aspect = context.aspect;

        this.meshid = 0;
        this.modelmatrix = LA.m4.identity();
        this.viewmatrix = LA.m4.identity();;
        this.projection = LA.m4.ortho(-1,1,-1,1,-10,10);
        
        this.gl_.enable(this.gl_.BLEND);
        //this.gl_.blendFunc(this.gl_.ONE, this.gl_.ONE_MINUS_SRC_ALPHA);
        //this.gl_.blendFunc(this.gl_.SRC_ALPHA, this.gl_.ONE);
        this.gl_.blendFunc(this.gl_.SRC_ALPHA, this.gl_.ONE_MINUS_SRC_ALPHA);

        this.scene_ = { meshes : [] };
        this.loadShaders_(this.scene_, "program_lines", sv_lines, sf_lines);
        this.initAttribs_(this.scene_, 
           [['direction', 1, this.gl_.FLOAT ], 
            ['position',  3, this.gl_.FLOAT ], 
            ['next',      3, this.gl_.FLOAT ], 
            ['previous',  3, this.gl_.FLOAT ], 
            ['vcolor',    4, this.gl_.FLOAT ]]
        );
        this.initUniforms_(this.scene_, ['model','view','projection','aspect','thickness','miter']);
    }

    clearMeshes(){
        this.scene_.meshes = [];
    }

    lineBufferData(vertex1, vertex2){
        var x1 = vertex1.x;
        var y1 = vertex1.y;   
        var z1 = vertex1.z;
        var x2 = vertex2.x;          
        var y2 = vertex2.y;
        var z2 = vertex2.z;  

          var data = [];
          data.push(x1+(x2-x1)*0);
          data.push(y1+(y2-y1)*0);
          data.push(z1+(z2-z1)*0);
          data.push(x1+(x2-x1)*0.5);
          data.push(y1+(y2-y1)*0.5);
          data.push(z1+(z2-z1)*0.5);
          data.push(x1+(x2-x1)*1);
          data.push(y1+(y2-y1)*1);
          data.push(z1+(z2-z1)*1);
          return data;
    }

    loadShaders_(scene, programname, vertcode, fragcode) {
        var sv = this.context.loadShader(vertcode, "vert");
        var sf = this.context.loadShader(fragcode, "frag");
        scene.program = this.context.createProgram(programname, sv, sf);
    };

    initAttribs_(scene, attribs) {
        this.gl_.useProgram( scene.program.program );
        scene.attributes = [];
        var that = this;
        attribs.forEach(function(attrib){
           var lastindex = scene.attributes.length;
           var obj = {
             name : attrib[0],
             loc  : that.gl_.getAttribLocation(scene.program.program, attrib[0]),
             size : attrib[1],
             type : attrib[2],
           };
           scene.attributes[lastindex] = obj;
           console.log("Init Attribute: ",
            scene.attributes[lastindex].name,
            scene.attributes[lastindex].loc,
            scene.attributes[lastindex].size,
            scene.attributes[lastindex].type);
        });
    }
    
    initUniforms_(scene, attribs) {
        this.gl_.useProgram( scene.program.program );
        scene.uniforms = [];
        var that = this;
        attribs.forEach(function(attrib){
           var lastindex = scene.uniforms.length;
           var obj = {
             name : attrib,
             loc  : that.gl_.getUniformLocation(scene.program.program, attrib),
           };
           scene.uniforms[lastindex] = obj;
           console.log("Init Uniforms: ",
            scene.uniforms[lastindex].name,
            scene.uniforms[lastindex].loc);
        });
    }

    fillBuffers_(scene){
      var vertices = 0;
      var that = this;
      scene.meshes.forEach(function(mesh, index){
        vertices += mesh.positions.length/3;
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[0] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.directions, that.gl_.DYNAMIC_DRAW );
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[1] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.positions, that.gl_.DYNAMIC_DRAW );
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[2] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.next, that.gl_.DYNAMIC_DRAW );
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[3] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.previous, that.gl_.DYNAMIC_DRAW );
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[4] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.colors, that.gl_.DYNAMIC_DRAW );
        that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[5] );
        that.gl_.bufferData(that.gl_.ARRAY_BUFFER, mesh.meshIds, that.gl_.DYNAMIC_DRAW );
      });
      console.log("VERTICES OF ALL MESHES: "+vertices);
    }

    addLineMesh_(scene, data, color, opaque) {
        let path = new Float32Array(data);
        let vertices   = path.length / 3;
        let positions  = [];
        let previous   = [];
        let next       = [];
        let directions = [];
        let colors     = [];
        let meshIds    = [];

        //DUPLICATE
        for(var i = 0; i<(vertices-1); i++){
            directions.push(-1.0);
            directions.push(1.0);
            directions.push(-1.0);
            directions.push(-1.0);
            directions.push(1.0);
            directions.push(1.0);
        }

        for(var i = 0; i<(vertices-1)*6; i++){
            colors.push(color[0]);
            colors.push(color[1]);
            colors.push(color[2]);
            colors.push(opaque);
        }

        for(var i = 0; i<(vertices-1); i++){
            meshIds.push(this.meshid);
            meshIds.push(this.meshid);
            meshIds.push(this.meshid);
            meshIds.push(this.meshid);
            meshIds.push(this.meshid);
            meshIds.push(this.meshid);
        }
        this.meshid += 1;

        for(var i = 0; i<(vertices-1)*3; i+=3){
            positions.push(path[i+0]);
            positions.push(path[i+1]);
            positions.push(path[i+2]); //P1

            positions.push(path[i+0]);
            positions.push(path[i+1]);
            positions.push(path[i+2]); //P1dup

            positions.push(path[i+3]);
            positions.push(path[i+4]);
            positions.push(path[i+5]); //P2

            positions.push(path[i+3]);
            positions.push(path[i+4]);
            positions.push(path[i+5]); //P2

            positions.push(path[i+0]);
            positions.push(path[i+1]);
            positions.push(path[i+2]); //P1dup

            positions.push(path[i+3]);
            positions.push(path[i+4]);
            positions.push(path[i+5]); //P2dup
        }

            previous.push(path[0]);
            previous.push(path[1]);
            previous.push(path[2]); //P1

            previous.push(path[0]);
            previous.push(path[1]);
            previous.push(path[2]); //P1dup

            previous.push(path[3]);
            previous.push(path[4]);
            previous.push(path[5]); //P2

            previous.push(path[3]);
            previous.push(path[4]);
            previous.push(path[5]); //P2

            previous.push(path[0]);
            previous.push(path[1]);
            previous.push(path[2]); //P1dup

            previous.push(path[3]);
            previous.push(path[4]);
            previous.push(path[5]); //P2dup

        for(var i = 0; i<(vertices-1)*3-3; i+=3){
            previous.push(path[i+0]);
            previous.push(path[i+1]);
            previous.push(path[i+2]); //P1

            previous.push(path[i+0]);
            previous.push(path[i+1]);
            previous.push(path[i+2]); //P1dup

            previous.push(path[i+3]);
            previous.push(path[i+4]);
            previous.push(path[i+5]); //P2

            previous.push(path[i+3]);
            previous.push(path[i+4]);
            previous.push(path[i+5]); //P2

            previous.push(path[i+0]);
            previous.push(path[i+1]);
            previous.push(path[i+2]); //P1dup

            previous.push(path[i+3]);
            previous.push(path[i+4]);
            previous.push(path[i+5]); //P2dup
        }

        for(var i = 3; i<(vertices-1)*3; i+=3){
            next.push(path[i+0]);
            next.push(path[i+1]);
            next.push(path[i+2]); //P1

            next.push(path[i+0]);
            next.push(path[i+1]);
            next.push(path[i+2]); //P1dup

            next.push(path[i+3]);
            next.push(path[i+4]);
            next.push(path[i+5]); //P2

            next.push(path[i+3]);
            next.push(path[i+4]);
            next.push(path[i+5]); //P2

            next.push(path[i+0]);
            next.push(path[i+1]);
            next.push(path[i+2]); //P1dup

            next.push(path[i+3]);
            next.push(path[i+4]);
            next.push(path[i+5]); //P2dup
        }
        next.push(path[path.length-6+0]);
        next.push(path[path.length-6+1]);
        next.push(path[path.length-6+2]); //P1

        next.push(path[path.length-6+0]);
        next.push(path[path.length-6+1]);
        next.push(path[path.length-6+2]); //P1dup

        next.push(path[path.length-6+3]);
        next.push(path[path.length-6+4]);
        next.push(path[path.length-6+5]); //P2

        next.push(path[path.length-6+3]);
        next.push(path[path.length-6+4]);
        next.push(path[path.length-6+5]); //P2

        next.push(path[path.length-6+0]);
        next.push(path[path.length-6+1]);
        next.push(path[path.length-6+2]); //P1dup

        next.push(path[path.length-6+3]);
        next.push(path[path.length-6+4]);
        next.push(path[path.length-6+5]); //P2dup


        var mesh = {
            directions : new Float32Array(directions),
            positions  : new Float32Array(positions),
            previous   : new Float32Array(previous),
            next       : new Float32Array(next),
            colors     : new Float32Array(colors),
            meshIds    : new Float32Array(meshIds),
            size       : path.length,
            bufs       : [
                this.gl_.createBuffer(),
                this.gl_.createBuffer(),
                this.gl_.createBuffer(),
                this.gl_.createBuffer(),
                this.gl_.createBuffer(),
                this.gl_.createBuffer()],
            lineverts  : vertices,
            triverts   : (vertices-1)*6
        }; 

        /*console.log( "PER MESH:"+" ID"+mesh.meshIds[0],
            "vertices:"+mesh.triverts,
            "directions:"+directions.length,
            "positions:"+positions.length,
            "previous:"+previous.length,
            "next:"+next.length,
            "colors:"+colors.length,
            "meshIds:"+meshIds.length
        );*/

        scene.meshes[scene.meshes.length] = mesh;
    };

    draw_(scene, mesh) {   
        var lineverts = mesh.lineverts;
        var triverts  = mesh.triverts;
        var start = 0;

        this.gl_.useProgram( scene.program.program );

        var that = this;
        scene.attributes.forEach(function(attribute, index){
           that.gl_.bindBuffer(that.gl_.ARRAY_BUFFER, mesh.bufs[index] );
           that.gl_.enableVertexAttribArray( attribute.loc );
           that.gl_.vertexAttribPointer(attribute.loc, attribute.size, attribute.type, false, 0, 0);
        });
    
        this.gl_.drawArrays(this.gl_.TRIANGLES, start, triverts);
    };

    draws_(scene){
        var that = this;
        scene.meshes.forEach(function(mesh, index){
            that.draw_(scene, mesh);
        });
    }

    uniforms_(scene) {
        this.gl_.uniformMatrix4fv(scene.uniforms[0].loc, false, this.modelmatrix);
        this.gl_.uniformMatrix4fv(scene.uniforms[1].loc, false, this.viewmatrix);
        this.gl_.uniformMatrix4fv(scene.uniforms[2].loc, false, this.projection);
        this.gl_.uniform1f(scene.uniforms[3].loc, this.aspect);
        this.gl_.uniform1f(scene.uniforms[4].loc, this.thickness);
        this.gl_.uniform1i(scene.uniforms[5].loc, this.miter);
    };

}



    
    


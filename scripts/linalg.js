export function dot(v,w) {
    return v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
}
export function length(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}
export function normalize(v,w) {
    var d = length(w);
    v[0] = w[0]/d;
    v[1] = w[1]/d;
    v[2] = w[2]/d;
}
export function copy(v,w) {
    v[0] = w[0];
    v[1] = w[1];
    v[2] = w[2];
}
export function add(sum,v,w) {
    sum[0] = v[0] + w[0];
    sum[1] = v[1] + w[1];
    sum[2] = v[2] + w[2];
}
export function subtract(dif,v,w) {
    dif[0] = v[0] - w[0];
    dif[1] = v[1] - w[1];
    dif[2] = v[2] - w[2];
}
export function scale(ans,v,num) {
    ans[0] = v[0] * num;
    ans[1] = v[1] * num;
    ans[2] = v[2] * num;
}
export function cross(c,v,w) {
    var x = v[1]*w[2] - v[2]*w[1];
    var y = v[2]*w[0] - v[0]*w[2];
    var z = v[0]*w[1] - v[1]*w[0];
    c[0] = x;
    c[1] = y;
    c[2] = z;
}

export var m4 = {
      translation: function(tx, ty, tz) {
        return [
           1,  0,  0,  0,
           0,  1,  0,  0,
           0,  0,  1,  0,
           tx, ty, tz, 1,
        ];
      },
     
      xRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
          1, 0, 0, 0,
          0, c, s, 0,
          0, -s, c, 0,
          0, 0, 0, 1,
        ];
      },
     
      yRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
          c, 0, -s, 0,
          0, 1, 0, 0,
          s, 0, c, 0,
          0, 0, 0, 1,
        ];
      },
     
      zRotation: function(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
     
        return [
           c, s, 0, 0,
          -s, c, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1,
        ];
      },

      xyzRotation: function(ax, ay, az) {
        var cx = Math.cos(ax);
        var sx = Math.sin(ax);
        var cy = Math.cos(ay);
        var sy = Math.sin(ay);
        var cz = Math.cos(az);
        var sz = Math.sin(az);
     
        return [
                      cy*cz,            cy*sz,       -sy, 0,
           sx*sy*cz - cx*sz, sx*sy*sz + cx*cz,     sx*cy, 0,
           cx*sy*cz + sx*sz, cx*sy*sz - sx*cz,     cx*cy, 0,
                          0,                0,         0, 1,
        ];
      },
     
      scaling: function(sx, sy, sz) {
        return [
          sx, 0,  0,  0,
          0, sy,  0,  0,
          0,  0, sz,  0,
          0,  0,  0,  1,
        ];
      },

      identity: function() {
        return [
          1,  0,  0,  0,
          0,  1,  0,  0,
          0,  0,  1,  0,
          0,  0,  0,  1,
        ];
      },

      view: function(s) {
        return [
          s,  0,  0,  0,
          0,  s,  0,  0,
          0,  0,  1,  0,
          0,  0, -1,  1,
        ];
      },

      ortho(l, r, b, t, n, f) {
      return [
            2 / (r - l),                  0,             0,  - (r + l) / (r - l),
                      0,        2 / (t - b),             0,  - (t + b) / (t - b),
                      0,                  0,  -2 / (f - n),  - (f + n) / (f - n),
                      0,                  0,             0,                    1,
      ];
      },


  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  multiplyvec: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b0 = b[0];
    var b1 = b[1];
    var b2 = b[2];
    var b3 = b[3];

    return [
      b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
      b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
      b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
      b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
    ];
  },
};


export class Vertex {
      constructor(x,y,z) {
       this.x = x;
       this.y = y;
       this.z = z;
      }
    }

export class Line {
      constructor(v1index,v2index) {
       this.v1index = v1index;
       this.v2index = v2index;
      }
    }

export function rand(){
    return Math.random()*2-1;
}

export function randb(){
    return Math.round( Math.random() )*2-1;
}

export function makeVertex(vertexarray, index){
      var x = rand();
      var y = rand();
      var z = rand();
      vertexarray[index] = new Vertex(x,y,z);
    }

export function distance(v1, v2){
       var v3x = (v2.x-v1.x);
       var v3y = (v2.y-v1.y);
       var v3z = (v2.z-v1.z);
       return (Math.sqrt(v3x*v3x + v3y*v3y + v3z*v3z));
}

export function orbit_distance(vertex, v_orig, radius){
    return Math.abs( radius-distance(vertex, v_orig) );
}

export function orbit_distances(vertex_arr, v_orig, radius){
    var od = 0;
    vertex_arr.forEach(function(vertex){
        od += orbit_distance(vertex, v_orig, radius);
    });
    return od;
}

export function sum_of_distances(vertex_arr, lines){
    var sod = 0;
    lines.forEach(function(l){
        sod += distance(vertex_arr[l.v1index], vertex_arr[l.v2index]);
    });
    return sod;
}

/********** GRAPH ***********/
export class Graph{
      constructor(vertices,lines,center) {
       this.vertices = vertices;
       this.lines    = lines;
       this.center   = center;
      }
    }

export function createRandomGraph(vertexamt, lineprob, radius, opt_rate, opt_repeats){
        var vertices = [];
        var lines = [];
        var center = new Vertex(0,0,0);

        // Create Random Vertices
        for(var i = 0; i<vertexamt; i++){
          makeVertex(vertices, i);
          for(var j = 0; j<Math.min(vertexamt, vertices.length); j++){
             if(i == j){ continue; }
             while(distance(vertices[j], vertices[i]) < 2){
                 makeVertex(vertices, i);
             }
          }
        }
        
        // Create Random Lines
        for(var i = 0; i<vertexamt; i++){
          for(var j = i; j<vertexamt; j++){
             var drawline = Math.round( Math.random()*(0.5+lineprob*0.5) );
             if(drawline){  lines.push(new Line(i,j)); }
          }
        } 

        var randomGraph = new Graph(vertices, lines, center);

        // Optimize Mesh
        for(var tries = 0; tries<opt_repeats; tries++){
            optimize_graph_to_sphere(randomGraph, radius, opt_rate);
        }
        return randomGraph;
    }

export function createCustomGraph(vertexamt, links, radius, opt_rate, opt_repeats){
        var vertices = [];
        var lines = [];
        var center = new Vertex(0,0,0);

        // Create Random Vertices
        for(var i = 0; i<vertexamt; i++){
          makeVertex(vertices, i);
          for(var j = 0; j<Math.min(vertexamt, vertices.length); j++){
             if(i == j){ continue; }
             while(distance(vertices[j], vertices[i]) < 2){
                 makeVertex(vertices, i);
             }
          }
        }
        
        // Create Custom Lines
        for(var i = 0; i<vertexamt; i++){
          for(var j = i+1; j<vertexamt; j++){
             if(links[i].includes(j)){ lines.push(new Line(i,j)); }
          }
        } 

        var customGraph = new Graph(vertices, lines, center);

        // Optimize Mesh
        for(var tries = 0; tries<opt_repeats; tries++){
            optimize_graph_to_sphere(customGraph, radius, opt_rate);
        }
        return customGraph;
    }


export function optimize_graph_to_sphere(graph, radius, opt_rate){
        function motion_i(arr, i, vec){
           arr[i].x += vec[0];
           arr[i].y += vec[1];
           arr[i].z += vec[2];
        }
        var vertices  = graph.vertices;
        var vertexamt = vertices.length;
        var lines     = graph.lines;
        var lineamt   = lines.length;
        var center    = graph.center;

        // Make a copy of all Vertices
        var v_copy = vertices.map(obj => ({...obj}));
        for(var i = 0; i<vertexamt; i++){
           var vec = [];
           var od = orbit_distance(v_copy[i], center, radius);
           vec[0] = rand() * opt_rate * od;
           vec[1] = rand() * opt_rate * od;
           vec[2] = rand() * opt_rate * od;
           motion_i(v_copy, i, vec);
        }

        var sod_old = sum_of_distances(vertices, lines) / lineamt;
        var sod_new = sum_of_distances(v_copy, lines) / lineamt;
        var od_old = orbit_distances(vertices, center, radius) / vertexamt;
        var od_new = orbit_distances(v_copy, center, radius) / vertexamt;

        var score_old = sod_old * od_old;
        var score_new = sod_new * od_new;

        //console.log(score_old, score_new);

        if(score_new < score_old){
            graph.vertices = v_copy.map(obj => ({...obj}));
        }
        //console.log(sod_old, sod_new, od_old, od_new);
    }

export function createCubeGraph(){
        var vertices = [];
        var lines = [];
        var center = new Vertex(0,0,0);

        vertices[0] = new Vertex(-0.5,-0.5,-0.5);
        vertices[1] = new Vertex( 0.5,-0.5,-0.5);
        vertices[2] = new Vertex( 0.5, 0.5,-0.5);
        vertices[3] = new Vertex(-0.5, 0.5,-0.5);

        vertices[4] = new Vertex(-0.5,-0.5, 0.5);
        vertices[5] = new Vertex( 0.5,-0.5, 0.5);
        vertices[6] = new Vertex( 0.5, 0.5, 0.5);
        vertices[7] = new Vertex(-0.5, 0.5, 0.5);

        vertices[8] = new Vertex( 0.0, 0.0, 0.0);
        vertices[9] = new Vertex( 0.0, 1.0, 0.0);
        vertices[10] = new Vertex( 1.0, 0.0, 0.0);

        lines[0] = new Line(0,1);
        lines[1] = new Line(1,2);
        lines[2] = new Line(2,3);
        lines[3] = new Line(3,0);
        lines[4] = new Line(0,2);

        lines[5] = new Line(4,5);
        lines[6] = new Line(5,6);
        lines[7] = new Line(6,7);
        lines[8] = new Line(7,4);
        lines[9] = new Line(4,6);

        lines[10] = new Line(0,4);
        lines[11] = new Line(1,5);
        lines[12] = new Line(2,6);
        lines[13] = new Line(3,7);

        lines[14] = new Line(8,9);
        lines[15] = new Line(8,10);

        var cubeGraph = new Graph(vertices, lines, center);

        return cubeGraph;
    }



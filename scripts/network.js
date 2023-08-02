import { LineShading } from '../sripts/lines.js';
import { Webgl } from '../sripts/webgl.js';
import * as LA from '../sripts/linalg.js';
import { TrackballRotator } from '../sripts/trackball.js';

"use strict";
$(document).ready(function(){
    /*******   PARAMS   *********/
    var active_vert = 0;                // CURRENT ACTIVE NODE
    var color = [0.2,0.2,0.2];          // GRAPH EDGE COLORS
    var default_opaque = 0.1;          // EDGE ALPHA WHEN NOT ACTIVE
    //var default_opaque = 0.0;
    var imagesize = 60;
    var imageamt = 166;


    var filterStrength = 20;
    var frameTime = 0;
    var lastLoop = new Date;
    var thisLoop;
    function updateFPS(){
        var thisFrameTime = (thisLoop=new Date) - lastLoop;
        frameTime+= (thisFrameTime - frameTime) / filterStrength;
        lastLoop = thisLoop;
    }
    // Report the fps only every second, to only lightly affect measurements
    setInterval(function(){ 
        var fps = (1000/frameTime).toFixed(1);
        $("#fps").html("FPS: "+fps);
        console.log("FPS: "+fps);
    },1000);

    /******** RENDER FUNTION MUST BE IMPLEMENTED FOR TRACKBALLROTATOR *****/
    var render_ = function() {
        ls.gl_.viewport(0, 0, context.viewport_w, context.viewport_h);
        ls.gl_.clearColor(0,0,0,0);
        ls.gl_.clear( ls.gl_.COLOR_BUFFER_BIT ); 

        updateFPS();
        
        if(rotator.isMoving()||rotator.isZooming()){ 
            if(rotator.isDelay()){ 
                rotator.moveDel();
            }
            updateMVP();
            updateNodeImages(mobile);
        }

        if(resize){
            updateMVP();
            updateNodeImages(mobile);
            resize = false;
        }

        ls.draws_(ls.scene_);

        ls.gl_.flush();
        requestAnimationFrame(render_);
    };

    var updateMVP = function(){
        ls.modelmatrix = LA.m4.identity();
        ls.viewmatrix = rotator.getViewMatrix();
        ls.projection = rotator.getProjMatrix();
        ls.uniforms_(ls.scene_); 
    }

    var updateGraphMesh = function(graph, active_vert){
        ls.clearMeshes();
        var vertices = graph.vertices;
        var lines    = graph.lines;
        lines.forEach(function(l){
            var opaque = default_opaque;
            if(l.v1index == active_vert || l.v2index == active_vert ){ opaque = 0.5; }
            ls.addLineMesh_(ls.scene_, ls.lineBufferData(vertices[l.v1index],vertices[l.v2index]), color, opaque);
        }); 
        ls.fillBuffers_(ls.scene_); 
    }    

    function updateNodeImages(mobile = true){
        for(var i = 0; i<imageamt; i++){
            thumbs[i].hide();
            thumbs[i].removeClass("active")
        }

        graph.lines.forEach(function(l){
            if(l.v1index == active_vert || l.v2index == active_vert ){ 
                thumbs[l.v1index].show();
                thumbs[l.v2index].show();
            }
        }); 

        thumbs[active_vert].addClass("active");

        var index_to_depth = {};
        for(var i = 0; i<imageamt; i++){
            var position = [
                graph.vertices[i].x,
                graph.vertices[i].y,
                graph.vertices[i].z,
                1 ];

            var vm = LA.m4.multiply(ls.viewmatrix, ls.modelmatrix);
            var pvm = LA.m4.multiply(ls.projection, vm);
            var cp = LA.m4.multiplyvec(pvm, position); 
            
            index_to_depth[i] = cp[2];
        }

        let sortable = [];
        for (var index in index_to_depth) {
           sortable.push([index, index_to_depth[index]]);
        }
        sortable.sort(function(a, b) {
           return a[1] - b[1];
        });


        var z_index = 1;
        for(var i = 0; i<imageamt; i++){
            var index = sortable[i][0];
            var position = [
                graph.vertices[index].x,
                graph.vertices[index].y,
                graph.vertices[index].z,
                1 ];

            var vm = LA.m4.multiply(ls.viewmatrix, ls.modelmatrix);
            var pvm = LA.m4.multiply(ls.projection, vm);
            var cp = LA.m4.multiplyvec(pvm, position); 
            var aspectVec = [ls.aspect, 1.0];

            var currentScreenXsigned = (cp[0] / cp[3])/2 * aspectVec[0];
            var currentScreenYsigned = (cp[1] / cp[3])/2 * aspectVec[1];
            var currentScreenX = (currentScreenXsigned+1)/2;
            var currentScreenY = (currentScreenYsigned+1)/2;
            
            var imgx = currentScreenX*context.rect.width;
            var imgy = context.rect.height-currentScreenY*context.rect.height;
            thumbs[index].css("top", imgy-imagesize/2).css("left", imgx-imagesize/2);
            thumbs[index].css("z-index", z_index++);

            if(!mobile){
                if(index == active_vert){ thumbs[index].css("filter", "none"); continue; }
                var blur = Math.round(((imageamt-(z_index)) / imageamt)*5);
                thumbs[index].css("filter", "blur("+(blur)+"px) drop-shadow(0px 0px "+(z_index)+"px rgba(0,0,0,0.8))");
                //var opac = 1-Math.round(((imageamt-(z_index)) / imageamt)*100)/100;
                //thumbs[index].css("opacity", opac);   
            }else{
                thumbs[index].css("filter", "none");
            }
        }
    };

    var display_vert = active_vert;
    function updateMainImage(display_vert){
        for(var i = 0; i<imageamt; i++){
            images[i].hide();
        }
        images[display_vert].show();

        $.main_image_cont.unbind();
        $.main_image_cont.bind("mousedown tap", function(evt){
            evt.preventDefault();
            var href = infos[display_vert].href;
            if(href != null){
                window.open("/action/"+href);
            }else{
                alert("Don't you dare to touch a construction site.")
            }
        });

        $.main_info.html("");
        var info = infos[display_vert];
        if(info){
            var el = info['title'];
            var title = $("<p>title: </p>");
            $.main_info.append(title);
            title.append("<span>"+el+"</span>   (#"+display_vert+")")
            title.addClass("info_title");

            var arr = info['operators'];
            var operators = $("<p>operators: </p>");
            $.main_info.append(operators);
            arr.forEach(function(el){
                operators.append("<span>"+el+"</span>")
            });

            var arr = info['elements'];
            var elements = $("<p>elements: </p>");
            $.main_info.append(elements);
            arr.forEach(function(el){
                elements.append("<span>"+el+"</span>")
            });

            var arr = info['theme'];
            var theme = $("<p>theme: </p>");
            $.main_info.append(theme);
            arr.forEach(function(el){
                theme.append("<span>"+el+"</span>")
            });
        }
    };


    // NAVIGATE MANUALLY THROUGH ALL IMAGES
    $("#button_prev").bind("mousedown tap", function(evt){
        active_vert = (active_vert-1);
        if(active_vert<0){  active_vert = imageamt-1; }
        display_vert = active_vert;
        updateNodeImages(mobile);
        updateGraphMesh(graph, active_vert);
        updateMainImage(display_vert);
    });

    $("#button_next").bind("mousedown tap", function(evt){
        active_vert = (active_vert+1) % imageamt;
        display_vert = active_vert;
        updateNodeImages(mobile);
        updateGraphMesh(graph, active_vert);
        updateMainImage(display_vert);
    });



    // CHANGE GRAPH APPEARANCE (REDUCED RENDERING) WHEN MOBILE VERSION
    function checkMobile(x) {
       if (x.matches) { mobile = true; } 
       else { mobile = false; }
       updateNodeImages(mobile);
    }
    var mobile = false;
    var mediaquery = window.matchMedia("(max-width: 600px)");
    mediaquery.addListener(checkMobile);

    var resize = false;
    window.addEventListener('resize', function(){ 
        resize = true;
    }); 




    var thumbs = [];
    var images = [];
    function createDOM(graph){ 
      /****************   CREATE GRAPH  ***************/
      // CREATE IMAGE NODES
      for(var i = 0; i<imageamt; i++){
            $.image_cont = $(document.createElement("div"));
            $.image_cont.attr("class","img_cont");
            $.image = $(document.createElement("img"));
            $.image.attr("src","../images/at_img_tiny/"+i+".png");
            $.image.attr("class","at_img");
            $.image.css("max-height", imagesize+"px");
            $.image_cont.css("height", imagesize+"px");
            $.image_cont.css("width", imagesize+"px");
            $.image_cont.attr("data-index",i);
            $.image_cont.append($.image);
            $("#img_div").append($.image_cont);
            thumbs.push($.image_cont);

            $.image_cont.on("click", function() {
                var data_index = $(this).attr("data-index");
                if(data_index == display_vert){ 
                   active_vert = data_index;
                   updateGraphMesh(graph,active_vert); 
                   updateNodeImages(thumbs, mobile);
                }
                display_vert = data_index;
                updateMainImage(display_vert);
            });
            $.image_cont.on("touchstart", function() {
                if(!rotator.isTouchable()){ return; }

                var data_index = $(this).attr("data-index");
                if(data_index == display_vert){ 
                   active_vert = data_index;
                   updateGraphMesh(graph,active_vert); 
                   updateNodeImages(thumbs, mobile);
                }
                display_vert = data_index;
                updateMainImage(display_vert);
            });
        }
        //HIDE ALL IMAGES BEFORE UPDATING POSITIONS
        for(var i = 0; i<imageamt; i++){
            thumbs[i].hide();
            thumbs[i].removeClass("active")
        }


        // LOAD MAIN IMAGES
        for(var i = 0; i<imageamt; i++){
            $.main_image = $(document.createElement("img"));
            $.main_image.attr("src","../images/at_img_small_jpg/"+i+".jpg");
            $.main_image.attr("class","main_img");
            $.main_image.attr("width", 512).attr("height", 512);
            $.main_image.hide();
            images.push($.main_image);
        }

        /****************   MAIN IMAGE  ***************/
        $.main_image_cont = $(document.createElement("div"));
        $.main_image_cont.attr("class","main_img_cont");
        for(var i = 0; i<imageamt; i++){
            $.main_image_cont.append(images[i]);
        }
        images[display_vert].show();
        $("#information_div").append($.main_image_cont);
        $.main_image_cont.append($.main_image);
        
        $.main_info = $(document.createElement("div"));
        $.main_info.attr("class","main_info");
        $("#information_div").append($.main_info);

        var result = {
            thumbs: thumbs, 
            images: images
        };
        return result;
    }





    /************ MAIN *************/

    var infos;
    var links = [];
    var graph;

    // INIT WEBGL
    var context = new Webgl(net, img_div, 100, 100, true, false);
    let mousearea = document.getElementById("img_div");
    var rotator = new TrackballRotator(context, render_, mousearea, 10);
    var ls = new LineShading(context);
    
    // HIDE DOCUMENT ONLY AFTER INIT, SO INIT CAN TAKE OVER ORIGINAL DIV SIZE
    $("#load").show();


    fetch("../data/infos.json")
    .then((res) => res.json())
    .then((data) => {
        infos = data;
        for(var i = 0; i<imageamt; i++){
           links[i] = infos[i].links;
        }})
    .then(() => {
        // INIT GRAPH MESH
        graph = LA.createCustomGraph(imageamt, links, 1.5, 0.1, 10000);  
        createDOM(graph); 
        updateMVP();
        updateGraphMesh(graph, active_vert); 


        // START RENDERING ONLY IF ALL IMAGES ARE LOADED
        var imagesloaded = 0;
        var thumbsloaded = 0;
        $(".at_img").on("load", function(){
            thumbsloaded++;
            console.log("THUMBNAIL PROGRESS: "+thumbsloaded+"/"+imageamt);
            $("#perc").html(
                "Load Thumbnails<br/>"+thumbsloaded+"/"+imageamt+"<br/>"+
                "Load Images<br/>"+imagesloaded+"/"+imageamt
            );
            if( imagesloaded+thumbsloaded >= (2*imageamt)*0.3 ){ $("#continue").show(); }
            if( imagesloaded >= imageamt && thumbsloaded >= imageamt ){ showDocument(); }
        });

        $(".main_img").on("load", function(){
            imagesloaded++;
            console.log("MAIN IMAGE PROGRESS: "+imagesloaded+"/"+imageamt);
            $("#perc").html(
                "Load Thumbnails<br/>"+thumbsloaded+"/"+imageamt+"<br/>"+
                "Load Images<br/>"+imagesloaded+"/"+imageamt
            );
            if( imagesloaded+thumbsloaded >= (2*imageamt)*0.3 ){ $("#continue").show(); }
            if( imagesloaded >= imageamt && thumbsloaded >= imageamt ){ showDocument(); }
        });

        $("#continue").on("click touch", function(){
            showDocument();
        });

        function showDocument(){
                // SHOW DOCUMENT
                $("#main").css("opacity", 1);
                $("#load").hide();

                // CONTINUE WITH RENDERING AFTER LOADING
                render_();
                updateNodeImages(mobile);
                updateMainImage(display_vert);
                checkMobile(mediaquery);
        }
    });


});



    
    


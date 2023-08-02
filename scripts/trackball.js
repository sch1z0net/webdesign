import * as LA from '../scripts/linalg.js';

export function TrackballRotator(context, callback, mousearea, viewDistance, viewpointDirection, viewUp) {
    var unitx = new Array(3);
    var unity = new Array(3);
    var unitz = new Array(3);
    var viewZ;  // view distance; z-coord in eye coordinates;
    var center; // center of view; rotation is about this point; default is [0,0,0] 
    var canvas = mousearea == null ? context.canvas : mousearea;
    var w = context.viewport_w;
    var h = context.viewport_h;
    var zoom = 1;

    var motion_delay_rate = 0.0004;
    var min_zoom = 0.5;
    var max_zoom = 2;

    this.setView = function( viewDistance, viewpointDirection, viewUp ) {
        unitz = (viewpointDirection === undefined)? [0,0,10] : viewpointDirection;
        viewUp = (viewUp === undefined)? [0,1,0] : viewUp;
        viewZ = viewDistance;
        LA.normalize(unitz, unitz);
        LA.copy(unity,unitz);
        LA.scale(unity, unity, LA.dot(unitz,viewUp));
        LA.subtract(unity,viewUp,unity);
        LA.normalize(unity,unity);
        LA.cross(unitx,unity,unitz);
    };

    this.getProjMatrix = function() {
        var projection = LA.m4.ortho(-1*zoom,1*zoom,-1*zoom,1*zoom,-10,10);
        return projection;
    }
    this.getViewMatrix = function() {
        var mat = [ unitx[0], unity[0], unitz[0], 0,
                unitx[1], unity[1], unitz[1], 0, 
                unitx[2], unity[2], unitz[2], 0,
                0, 0, 0, 1 ];
        if (center !== undefined) {  // multiply on left by translation by rotationCenter, on right by translation by -rotationCenter
            var t0 = center[0] - mat[0]*center[0] - mat[4]*center[1] - mat[8]*center[2];
            var t1 = center[1] - mat[1]*center[0] - mat[5]*center[1] - mat[9]*center[2];
            var t2 = center[2] - mat[2]*center[0] - mat[6]*center[1] - mat[10]*center[2];
            mat[12] = t0;
            mat[13] = t1;
            mat[14] = t2;
        }
        if (viewZ !== undefined) {
            mat[14] -= viewZ;
        }
        return mat;
    };
    this.getViewDistance = function() {
        return viewZ;
    };
    this.setViewDistance = function(viewDistance) {
        viewZ = viewDistance;
    };
    this.getRotationCenter = function() {
        return (center === undefined) ? [0,0,0] : center;
    };
    this.setRotationCenter = function(rotationCenter) {
        center = rotationCenter;
    };
    this.setView(viewDistance, viewpointDirection, viewUp);

    function applyTransvection(e1, e2) {  // rotate vector e1 onto e2
        function reflectInAxis(axis, source, destination) {
            var s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
            destination[0] = s*axis[0] - source[0];
            destination[1] = s*axis[1] - source[1];
            destination[2] = s*axis[2] - source[2];
        }
        LA.normalize(e1,e1);
        LA.normalize(e2,e2);
        var e = [0,0,0];
        LA.add(e,e1,e2);
        LA.normalize(e,e);
        var temp = [0,0,0];
        reflectInAxis(e,unitz,temp);
        reflectInAxis(e1,temp,unitz);
        reflectInAxis(e,unitx,temp);
        reflectInAxis(e1,temp,unitx);
        reflectInAxis(e,unity,temp);
        reflectInAxis(e1,temp,unity);
    }
    var centerX, centerY, radius2;
    var prevx,prevy;
    var dragging = false;
    var touchStarted = false;
    var scaling = false;
    var isMoving = false;
    var isDelay = false;
    var isZooming = false;
    var isTouchable = false;

    this.isMoving = function() {
       return isMoving;
    };

    this.isDelay = function() {
       return isDelay;
    };

    this.isZooming = function() {
       return isZooming;
    };

    this.isTouchable = function() {
       return isTouchable;
    };


    /**************  MOTION  **************/
    function move(x, y){
        delayX1 = prevx;
        delayY1 = prevy;
        delayX2 = x;
        delayY2 = y;

        move_dist += Math.hypot(delayX1-delayX2,delayY1-delayY2);

        isMoving = true;
        var ray1 = toRay(prevx,prevy);
        var ray2 = toRay(x,y);
        applyTransvection(ray1,ray2);
        prevx = x;
        prevy = y;
    }

        
    var delayX1 = 0;
    var delayY1 = 0;
    var delayX2 = 0;
    var delayY2 = 0;
    var delrate = 0;

    this.moveDel = function(){
        isMoving = true;
        var ray1 = toRay(delayX1,delayY1);
        var ray2 = toRay(delayX2,delayY2);
        applyTransvection(ray1,ray2);

        delayX2 += (delayX1-delayX2)*delrate;
        delayY2 += (delayY1-delayY2)*delrate;
        delrate += motion_delay_rate;

        //console.log("MOTION DELAY RATE: "+delrate );

        if(delrate>=0.2){ 
            delrate = 0; 
            isDelay = false; 
            isMoving = false;
        }
    }

    /**************  MOUSE HANDLING  **************/
    function zooming(evt) {
       evt.preventDefault();
       zoom += evt.deltaY * -0.01;
       if(zoom <= min_zoom){ zoom = min_zoom; }
       if(zoom >= max_zoom){ zoom = max_zoom; }
       isZooming = true;
    }

    function doMouseDown(evt) {
        if (dragging)
           return;
        centerX = w/2;
        centerY = h/2;
        var radius = Math.min(centerX,centerY);
        radius2 = radius*radius;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var box = context.rect;
        prevx = (evt.clientX - box.left) * context.scaleX;
        prevy = (evt.clientY - box.top) * context.scaleY;
        isDelay = false;
        dragging = true;
    }

    function doMouseDrag(evt) {
        if (!dragging)
           return;
        var box = context.rect;
        var x = (evt.clientX - box.left) * context.scaleX;
        var y = (evt.clientY - box.top) * context.scaleY;
        move(x, y); 
    }

    function doMouseUp(evt) {
        if (dragging) {
            document.removeEventListener("mousemove", doMouseDrag, false);
            document.removeEventListener("mouseup", doMouseUp, false);
            dragging = false;
            isDelay = true;
            delrate = 0;
        }
    }

    function pinchDist(evt){
        var r = context.rect;
        var x1 = (evt.touches[0].clientX - r.left) * context.scaleX / 1000;
        var x2 = (evt.touches[1].clientX - r.left) * context.scaleX / 1000;
        var y1 = (evt.touches[0].clientY - r.top) * context.scaleY / 1000;
        var y2 = (evt.touches[1].clientY - r.top) * context.scaleY / 1000;
        var dist = Math.hypot(x1 - x2, y1 - y2);
        return dist;  
    }

    var old_dist = 0;
    function pinchStart(evt){
        evt.preventDefault();
        old_dist = pinchDist(evt);
    }

    function pinchMove(evt){
        evt.preventDefault();
        var dist = pinchDist(evt);
        zoom += (dist - old_dist);
        if(zoom <= min_zoom){ zoom = min_zoom; }
        if(zoom >= max_zoom){ zoom = max_zoom; }
        old_dist = dist;
        isZooming = true;
    }

    function pinchEnd(evt){
        old_dist = 0;
        isZooming = false;
    }

    var move_dist = 0;
    function doTouchStart(evt) {
        isTouchable = false;
        if (evt.touches.length == 2) {
           scaling = true;
           pinchStart(evt);
           return;
        }

        /*if (evt.touches.length != 1) {
           doTouchCancel();
           return;
        }*/
        move_dist = 0;
        evt.preventDefault();
        var r = context.rect;
        prevx = (evt.touches[0].clientX - r.left) * context.scaleX;
        prevy = (evt.touches[0].clientY - r.top)  * context.scaleY;
        canvas.addEventListener("touchmove", doTouchMove, false);
        canvas.addEventListener("touchend", doTouchEnd, false);
        canvas.addEventListener("touchcancel", doTouchCancel, false);
        touchStarted = true;
        centerX = w/2;
        centerY = h/2;
        var radius = Math.min(centerX,centerY);
        radius2 = radius*radius;
    }
    function doTouchMove(evt) {
        isTouchable = false;
        if (scaling) {
           pinchMove(evt);
           return;
        }
        evt.preventDefault();
        /*if (evt.touches.length != 1 || !touchStarted) {
           doTouchCancel();
           return;
        }*/
        var box = context.rect;
        var x = (evt.touches[0].clientX - box.left) * context.scaleX;
        var y = (evt.touches[0].clientY - box.top)  * context.scaleY;
        move(x, y);
    }
    function doTouchEnd(evt) {
        isTouchable = false;
        isDelay = true;
        delrate = 0;
        if (scaling) {
           pinchEnd(evt);
           scaling = false;
        }

        doTouchCancel();
    }
    function doTouchCancel() {
        if(move_dist < 50){ move_dist = 0; isTouchable = true; }
        if (touchStarted) {
           touchStarted = false;
           canvas.removeEventListener("touchmove", doTouchMove, false);
           canvas.removeEventListener("touchend", doTouchEnd, false);
           canvas.removeEventListener("touchcancel", doTouchCancel, false);
        }
    }

    $(canvas).bind('mousedown', doMouseDown);
    $(canvas).bind('touchstart', doTouchStart);

    canvas.addEventListener( "wheel" , zooming,  { passive: false });

    function toRay(x,y) {  // converts a point (x,y) in pixel coords to a 3D ray by mapping interior of
                           // a circle in the plane to a hemisphere with that circle as equator.
       var dx = x - centerX;
       var dy = centerY - y;
       var vx = dx * unitx[0] + dy * unity[0];  // The mouse point as a vector in the image plane.
       var vy = dx * unitx[1] + dy * unity[1];
       var vz = dx * unitx[2] + dy * unity[2];
       var dist2 = vx*vx + vy*vy + vz*vz;
       if (dist2 > radius2) {  // Map a point ouside the circle to itself
          return [vx,vy,vz];
       }
       else {
          var z = Math.sqrt(radius2 - dist2);
          return  [vx+z*unitz[0], vy+z*unitz[1], vz+z*unitz[2]];
        }
    }
}
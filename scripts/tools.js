 $.fn.resize = function() {  

   var that = this;
   function updatesize(that){
     var w = window.innerWidth;
     var h = window.innerHeight;
     var dim = w<h ? w : h; 
     dim *= 0.9;
     that.css("width", dim+"px");
     that.css("height", dim+"px");
   }

   updatesize(that);
   window.addEventListener('resize', function(){ updatesize(that); }); 
   return this;
}


  function multitransform(target_name, op_arr){
     var code = "";
     var mod_i = [];
     var mod_j = [];
     op_arr.forEach(function(op, index){
         mod_i.push(0);
         mod_j.push(0);
     });

     eval(target_name).forEach(function(target, index){
       code += target_name+"["+index+"]";
       op_arr.forEach(function(op, opindex){
          code += "."+op_arr[opindex][0]+"("+op_arr[opindex][1][mod_i[opindex]]+"+"+op_arr[opindex][2][mod_j[opindex]]+")";
          mod_i[opindex] = (mod_i[opindex]+1)%op_arr[opindex][1].length;
          mod_j[opindex] = (mod_j[opindex]+1)%op_arr[opindex][2].length;
       });
       code += ".end();";
     });
     return code;
  }


/**** SVG ****/
$.fn.svg = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.g = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "g"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.polygon = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.text = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "text"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.circle = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "circle"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.rect = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

$.fn.path = function(attributes) {  
   $el = $(document.createElementNS("http://www.w3.org/2000/svg", "path"));
   $el.attr(attributes);
   this.append($el);
   return $el;
}

/**** DUPLICATE ELEMENTS *****/

$.fn.dup = function(id) {  
  var d = this.clone().prop('id', id );
  this.after( d );
  return d; 
}

$.fn.dups = function(until, add_new_index=true) {  
  var ds = [];
  if(!add_new_index){
    ds.push( this );
    for( var i = 2; i <= until; i++ ){
       ds.push( this.dup(this.attr('id').slice(0, -1) + i) );
    }
  }else{
    for( var i = 1; i <= until; i++ ){
       ds.push( this.dup(this.attr('id') + i) );
    }
  }
  return ds; 
}

/**** VIBRATION ****/
function uvib(speed, time, amp, offs){
  return ((Math.sin(time*speed)+1)/2)*amp+offs;
}

function svib(speed, time, amp, offs){
  return (Math.sin(time*speed))*amp+offs;
}

/**** TRANSFORMS ****/

$.fn.end = function() {  
  this.tr = null;
}

$.fn.tX = function(val) {  
  var str = "translateX"+"("+val+")";
  if (!(""+val).includes("px") && !(""+val).includes("%")){
    str = "translateX"+"("+val+"px)";
  }
  if(this.tr == null){
    this.tr = {'-webkit-transform' : str, '-moz-transform' : str, '-ms-transform' : str, '-o-transform' : str, 'transform' : str};
  }else{
    Object.keys(this.tr).forEach((item) => { this.tr[item] += str; });
  }
  this.css(this.tr); 
  return this; 
}

$.fn.tY = function(val) {  
  var str = "translateY"+"("+val+")";
  if (!(""+val).includes("px") && !(""+val).includes("%")){
    str = "translateY"+"("+val+"px)";
  }
  if(this.tr == null){
    this.tr = {'-webkit-transform' : str, '-moz-transform' : str, '-ms-transform' : str, '-o-transform' : str, 'transform' : str}; 
  }else{
    Object.keys(this.tr).forEach((item) => { this.tr[item] += str; });
  }
  this.css(this.tr); 
  return this; 
}

$.fn.r = function(val) {  
  var str = "rotate"+"("+val+"deg)";
  if(this.tr == null){
    this.tr = {'-webkit-transform' : str, '-moz-transform' : str, '-ms-transform' : str, '-o-transform' : str, 'transform' : str};
  }else{
    Object.keys(this.tr).forEach((item) => { this.tr[item] += str; });
  }
  this.css(this.tr); 
  return this; 
}

$.fn.s = function(val) {  
  var str = "scale"+"("+val+")";
  if(this.tr == null){
    this.tr = {'-webkit-transform' : str, '-moz-transform' : str, '-ms-transform' : str, '-o-transform' : str, 'transform' : str}; 
  }else{
    Object.keys(this.tr).forEach((item) => { this.tr[item] += str; });
  }
  this.css(this.tr); 
  return this; 
}
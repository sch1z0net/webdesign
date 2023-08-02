export class Webgl {
    constructor(canvas, divs, css_w, css_h, resize = true, fit_to_window = false) {
       var infoEl = document.createElement('input');
       infoEl.style.width = '100%';
       infoEl.style.border = '0px solid #000';
       //document.body.style.backgroundColor = '#000';
       
       var info = {frame: 0};
       this.info = info;
       this.gl = canvas.getContext('webgl', {antialias: true, premultipliedAlpha: false});  
       
       //that.resizeCanvas(fit_to_window);

       //if(!w){ css_w = window.innerWidth; }
       //if(!h){ css_h = window.innerHeight - infoEl.clientHeight;}   
       this.canvas = canvas;
       this.canvas.width = 1000;
       this.canvas.height = 1000;

       this.divs = divs;

       this.css_w = css_w;
       this.css_h = css_h;
       this.aspect = css_w / css_h;

       this.viewport_w = this.canvas.width;
       this.viewport_h = this.canvas.height;

       this.rect   = this.canvas.getBoundingClientRect();    // abs. size of element
       this.scaleX = this.canvas.width / this.rect.width;    // relationship bitmap vs. element for x
       this.scaleY = this.canvas.height / this.rect.height;  // relationship bitmap vs. element for y

       this.updateCSS();

       var that = this;

       if(resize){ 
         that.resizeCanvas(fit_to_window);
         window.addEventListener('resize', function(){ that.resizeCanvas(fit_to_window); }); 
       }

       window.addEventListener('onerror', function(e, url, line, col, err) { that.error(err); } )

       var lframe = 0;
       var ltime = (new Date()).getTime();
       setInterval(function(){
        var s = '';
        var time = (new Date()).getTime();
        var delay1 = time-ltime;
        ltime = time;
        info.fps = ((info.frame-lframe)/delay1)*1000;
        lframe = info.frame;
        for(var i in info) {
            s += i+': ';
            var val = info[i];
            if(typeof val === 'number')
                s += val.toFixed(2);
            else
                s += val;
            s += " ";
        }
        infoEl.value = s;
      }, 200);
    }

    loadShader(src, id) {
        var type = id == "frag" ? this.gl.FRAGMENT_SHADER : this.gl.VERTEX_SHADER;
        var source = src;
        var shader = this.gl.createShader(type);
        this.gl.shaderSource( shader, source );
        this.gl.compileShader( shader );
        if( ! this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) ) {
            this.error("error compile shader: "+id+" \n"+this.gl.getShaderInfoLog(shader)+"\n");
            null;
        }
        return {name: id, shader: shader, source: source, type: type};
    }


    createProgram(name, sv, sf) {
        var program = this.gl.createProgram();
        this.gl.attachShader( program, sv.shader );
        this.gl.attachShader( program, sf.shader );
        this.gl.linkProgram( program );
        if( !this.gl.getProgramParameter(program, this.gl.LINK_STATUS) ) {
            this.error( "can't link program "+name+":\n"+this.gl.getProgramInfoLog(program)+"\n" );
            return null;
        }
        this.gl.validateProgram( program );
        if( !this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) ) {
            this.error( "can't validate program "+name+":\n"+this.gl.getProgramInfoLog(program)+"\n" );
            return null;
        }
        return {name: name, program: program, sv: sv, sf: sf};
    }

    updateCSS(){
       $(this.canvas).css("width", this.css_w+"%").css("height", this.css_h+"%");
       if(this.divs){
           $(this.divs).css("width", this.css_w+"%").css("height", this.css_h+"%");
       }        
    }

    resizeCanvas(fit_to_window) {
        var window_w = window.innerWidth;
        var window_h = window.innerHeight;
        var min = window_w < window_h ? window_w : window_h; 
        
        if(window_w == min){  this.css_h = (this.css_w/this.aspect);
        }else{                this.css_w = (this.css_h*this.aspect)}
        
        this.updateCSS();
        /*var dim = w<h ? w : h; 
        dim *= 0.9;
        if(!fit_to_window){
              w = dim;
              h = dim;
        }*/
        
        this.rect   = this.canvas.getBoundingClientRect();    // abs. size of element
        this.scaleX = this.canvas.width / this.rect.width;    // relationship bitmap vs. element for x
        this.scaleY = this.canvas.height / this.rect.height;  // relationship bitmap vs. element for y
    }

    error(text) {
          var id = 'error-log';
          var el = document.getElementById(id);
          if(!el) {
            el = document.createElement('textarea');
            el.id = id;
            el.setAttribute('rows', 8);
            el.style.width = '100%';
            $(this.canvas).before($(el));
          }
          el.value += text+"\n";
          //render = function(){};
    }
}
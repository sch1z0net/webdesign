
"use strict";
$(document).ready(function(){
    var active = 0;
    var imageamt = 166;

    var images = [];
    var infos  = [];

    function init_dom(){
      $.editor_images = $(document.createElement("div"));
      $.editor_images.attr("class","editor_images");
      $("#main").append($.editor_images);

      $.main_box = $(document.createElement("div"));
      $.main_box.attr("class","main_box");

      // Main Info
      $.main_info = $(document.createElement("div"));
      $.main_info.attr("class","main_info");

      // Main Image
      $.main_image_cont = $(document.createElement("div"));
      $.main_image_cont.attr("class","main_img_cont");
      $.main_image = $(document.createElement("img"));
      $.main_image.attr("class","main_img");
      $.main_image.attr("width", 512).attr("height", 512);
      $.main_image.attr("src","../images/at_img_small_jpg/"+active+".jpg");

      $.images_cont = $(document.createElement("div"));
      $.images_cont.attr("class","images_cont");
    
      // Selectable Link Images
      for(var i = 0; i < imageamt; i++){
        $.image = $(document.createElement("img"));
        $.image.attr("class","select_img");
        $.image.attr("width", 512).attr("height", 512);
        $.image.attr("src","../images/at_img_small_jpg/"+i+".jpg");
        $.image.attr('draggable', false);
        $.images_cont.append($.image);  

        $.image.on("click",function(){
          $(this).toggleClass("active_link");
          update_json();
        });

        images.push($.image);
      }

      // Nav
      $.nav_left = $(document.createElement("div"));
      $.nav_left.attr("id","nav_left");
      $.nav_left.html("←");
      $.nav_left.on("click", function(){
          active = (active-1);
          if(active < 0){ active = infos.length-1; }
          $.main_image.attr("src","../images/at_img_small_jpg/"+active+".jpg");
          update_dom_selectables();
          update_dom_infos()
      });
 
      $.nav_right = $(document.createElement("div"));
      $.nav_right.attr("id","nav_right");
      $.nav_right.html("→");
      $.nav_right.on("click", function(){
          active = (active+1)%infos.length;
          $.main_image.attr("src","../images/at_img_small_jpg/"+active+".jpg");
          update_dom_selectables();
          update_dom_infos()
      });

      // APPENDS
      $.editor_images.append($.main_box);
      $.editor_images.append($.images_cont);

      $.main_box.append($.main_image_cont);
      $.main_box.append($.main_info);

      $.main_image_cont.append($.nav_left);
      $.main_image_cont.append($.main_image);
      $.main_image_cont.append($.nav_right);

      // Export Button
      $.export = $(document.createElement("button"));
      $.export.attr("class","export");
      $.export.html("export");
      $("#main").append($.export);
      
      $.export.on("click",function(){
         exportToJsonFile(infos); 
      });


      // MAIN INFO
      $.title = $(document.createElement("input"));
      $.title.attr("class","info");
      $.main_info.append($(document.createElement("p")).html("<span>title</span>").append($.title));

      $.operators = $(document.createElement("input"));
      $.operators.attr("class","info");
      $.main_info.append($(document.createElement("p")).html("<span>operators</span>").append($.operators));

      $.elements = $(document.createElement("input"));
      $.elements.attr("class","info");
      $.main_info.append($(document.createElement("p")).html("<span>elements</span>").append($.elements));

      $.theme = $(document.createElement("input"));
      $.theme.attr("class","info");
      $.main_info.append($(document.createElement("p")).html("<span>themes</span>").append($.theme));

      $.comment = $(document.createElement("textarea"));
      $.comment.attr("class","info_c");
      $.comment.attr("rows",10);
      $.main_info.append($(document.createElement("p")).html("<span>comment</span>").append($.comment));

      $(".info, .info_c").on("change", function(){
          update_json();
      });

      update_dom_infos();
    }
    
    function update_dom_infos(){
      var str_title = "";
      str_title += infos[active].title;
      $.title.prop("value",str_title);

      var str_operators = "";
      for (var i in infos[active].operators){
         if(i > 0){ str_operators += "," }
         str_operators += infos[active].operators[i];
      }
      $.operators.prop("value",str_operators);

      var str_elements = "";
      for (var i in infos[active].elements){
         if(i > 0){ str_elements += "," }
         str_elements += infos[active].elements[i];
      }
      $.elements.prop("value",str_elements);

      var str_theme = "";
      for (var i in infos[active].theme){
         if(i > 0){ str_theme += "," }
         str_theme += infos[active].theme[i];
      }
      $.theme.prop("value",str_theme);

      var str_comment = "";
      str_comment += infos[active].comment;
      $.comment.prop("value",str_comment);
    }

    function update_json(){
        if(active > infos.length){ return; }

        // UPDATE TITLE
        infos[active].title = $.title.prop("value");
        
        // UPDATE OPERATORS
        var operators = $.operators.prop("value").split(',');
        if(operators == null){ infos[active].operators = ""; }
        else if(!Array.isArray(operators)){ infos[active].operators = [operators]; } 
        else{ infos[active].operators = operators;  } 

        // UPDATE ELEMENTS
        var elements = $.elements.prop("value").split(',');
        if(elements == null){ infos[active].elements = ""; }
        else if(!Array.isArray(elements)){ infos[active].elements = [elements]; } 
        else{ infos[active].elements = elements;  } 

        // UPDATE THEME
        var theme = $.theme.prop("value").split(',');
        if(theme == null){ infos[active].theme = ""; }
        else if(!Array.isArray(theme)){ infos[active].theme = [theme]; } 
        else{ infos[active].theme = theme;  } 

        // UPDATE COMMENT
        infos[active].comment = $.comment.prop("value");

        // UPDATE LINKS
        infos[active].links = [];
        for(var i = 0; i < imageamt; i++){
            if(images[i].hasClass("active_link")){
                // PUSH LINK NODE IN ACTIVE NODE LINKS
                infos[active].links.push(i);
                console.log(i+" to "+active);
                // PUSH ACTIVE NODE IN LINKED NODE LINKS
                if( !(infos[i].links.includes(active)) ){ 
                    infos[i].links.push(active);
                    console.log(active+" to "+i); 
                }
                //console.log("Active:",active,"Selected:",i);
            }
        }
    }

    function update_dom_selectables(){
        $(".active_link").removeClass("active_link");
        $(".main_image").removeClass("main_image");
        var links = infos[active].links;
        for(var i = 0; i < links.length; i++){
            images[links[i]].addClass("active_link");
        }
        images[active].addClass("main_image");
    }

    fetch("../data/infos.json")
    .then((res) => res.json())
    .then((data) => {
        infos = data;
    })
    .then(() => {
        init_dom();
        update_dom_selectables();
    })
    .then(() => {
        $("#load").hide();
    });



    function exportToJsonFile(jsonData) {
      let dataStr = JSON.stringify(jsonData, null, 2);
      let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      let exportFileDefaultName = 'data.json';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }



});



    
    


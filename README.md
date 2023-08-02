# webdesign of sch1z0.net
Visit https://www.sch1z0.net for the final online experience.

**important note**: when you DOWNLOAD AND RUN the whole website locally on your computer, 
unfortunately most of the stuff doesn't get displayed like the original because of CROSS-ORIGIN issue. (google it)\
So as far as I know, you need to set up a *localhost* with for example *Apache HTTP Server* to make the website fully work.

## Basic technologies used:
* **HTML** for getting a rough framework, but most of the content is fed with
* **Javascript** which generates all of my
* **SVG** elements. You can also try to create SVG elements directly in the html's DOM structure, but for reusability of all the
triangles and stuff, I had to define the SVG with Javascript, or even with
* **JQuery** which makes it easier to manipulate DOM elements.
* **CSS** for styling the website is often still hardcoded in the html-files. Maybe I will modularize and export the CSS as well soon, but for now
you can directly see how one specific html was styled by just looking into the html code.
* **fonts** I've used from google, by *importing* them in the CSS code. I had to use some special google fonts to recreate the style of my original images.
* **JSON** You could feed all of the image information like title and comments and links directly into html. But it is a lot more practical to use an external
JSON file which organizes all of the relevant image information and then load it into your html. (because the code for it would be messy and long when used directly)

## Basic framework
consists of
* ***index.html***       -   the main page, which is linking to the other htmls and containing a small summary of my website
* ***intro/intro.html*** -   an intro, which contains some animation to give the visitor some vibes of my topic
* ***net.html***         -   the art project, the heart of my website containing all images displayed in an interactive map
* ***bio.html***         -   a bio, describing my person
* ***imprint.html***     -   an imprint, which is mandatory in germany

## The directory structure (sorted by relevance)
* ***scripts/***         -   all the javascript that is necessary to run the svgs, interactions and animations
* ***shaders/***         -   shaders for webgl that I'm using. Main shaders:
  * ***Noise shader***: which creates that static background noise on all my pages
  * ***Line shader***:  which is used for displaying thick lines in webgl
                                     you can see it in action in the map of images in net.html and
                                     in my rendered DNA structure where I use variable thick lines.
                                     Usually webgl only can render super thin lines. The Line shader
                                     takes the standard lines and makes them thicker.
* ***data/***            -   contains a JSON file (infos.json) which contains all the information/tags for net.html that
                     is displayed under each image, like: title, operators, elements, theme, comments
                      
* ***intro/***           -   an extra folder just for intro stuff\
* ***donation/***        -   an extra folder just for the donation stuff (when a visitor donates, he will get redirected to this)
* ***action/***          -   folder, containing all interactive images that you receive when you click on an image in net.html
* ***download/***        -   folder, containing all of my images in zipped format ready to download
* ***editor/***          -   this is kind of hidden to the visitor, it's only for the purpose of easily generating/editing the infos.json

## Where did I START?
I started to build the website with a few simple HTMLs, just hardcoded my animations and interactions, \
and soon modularized all of the javascript to clean up the code. The best start would be to look into\
the interactive images in **action/** where I mainly use **scripts/noise.js** \
(for the static background realizied with webgl shaders) and **scripts/tools.js** (for general functions and SVG creation)\
to build up the interactive content. It could still be a little bit confusing at the beginning, but\
when you follow the referenced functions, you might comprehend all of the code in the end.

## RESPONSIVE DESIGN
To create the website and program with javascript is one thing.. To make it work on all devices and browsers is another much more difficult thing.
That's why I am using **media queries** in CSS to distinguish the mobile use case from desktop use case. The whole design has to be compressed on
mobile phone and I am also disabling the static background noise created by **scripts/noise.js** because it just looks crazy and wrong on my mobile device.

Another important thing to mention is the *<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />*
code snippet in all of my html files (see at the top). You mainly need to use this so that your mobile device doesn't scale into the website,
and to have a guaranteed fixed website size.

I also worked my way through responsive design by tweeking it in javascript in **scripts/webgl.js** but it is not a fully finished solution yet.
Mainly you have to pay attention to the **canvas** element's width and height properties which are defined in two ways: as a variable in the DOM elemnt itself,
and as a CSS style variable. These two things are different and have to be coordinated. The CSS variables define the actual size of the displayed canvas,
while the DOM element's variable define the resolution of the webgl stuff running on the canvas. 


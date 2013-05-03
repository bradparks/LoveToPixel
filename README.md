# LoveToPixel #
This file last updated: Aug 4, 2012

<script>alert('hello')</script>

LTP is an experiment to see if I can pull off a full fledged pixel editor using JavaScript and canvas. The measure of success is if LTP ends up being a pixel editor that works so well, is responsive enough, powerful enough and enjoyable enough to use that people would seriously consider using it over a native pixel editor.

# Game breaking bug in Chrome :( #

Chrome used to support -webkit-optimize-contrast in OSX, now it doesn't. A bug for this has been filed here:
http://code.google.com/p/chromium/issues/detail?id=106662  
  
LoveToPixel relies on this feature quite a bit, without it zooming in Chrome will be blurry and the app will become unresponsive (since Chrome is now doing a much more expensive zooming algorithm). The real fix is to not rely on this feature of browsers and implement zooming manually. I've just not done it, and don't see it happening anytime soon. If you want to play with LTP, Firefox is the best browser to use now.

# Design Goals #
I am envisioning LTP being targeted at more advanced users. People who love to create pixel art very efficiently. The interface will almost entirely be just the main drawing window, with a mere sliver of interface at the top showing either the current palette or current brushes (depending on which mode is triggered), and a tiny status bar at the bottom. All other interactions with LTP will be handled through key commands. 

## The first set of features I'm aiming at: ##
* good layer management (status: in place)
* easily set/change the left and right brushes (status: in place)
* grid overlay (status: in place, but isn't useful yet)
* zoom in/out (status: in place)
* hold the 'a' key to temporarily zoom to 100% (once you release 'a', it returns to whatever zoom you were at) (status: in place)
* Save images in an intermediate format (maintain layers primarily) (status: in place)
* Save images as pngs (status: in place, in a simple fashion)
* unlimited, or at least very deep, undo/redo (status: in place for paint operations, not yet in place for anything else such as layer edits)
* A pixel pipeline which allows for things like snap to grid, lock vertical/horizontal, snap to brush size, etc (status: in place)
* Local storage support (status: in place)
* Server storage support (status: brainstorming)
* eye dropper tool (status: in place)
* paint bucket tool (status: in place)

## Future Features ##
* Animation support
* version control support
* color theme creation
* detailed brush editor
* copy/cut/paste regions
* server side persistence
* Preview window
* History window
* Full persistence (save undo/redo state, brush state, etc)

# So far... beta availabe at ... #
I have deployed the current beta version of LTP to http://mattgreer.org/media/loveToPixel/index.html

A screencast to get you started is here: http://screencast.com/t/IKylk02n9X
  
Here are the key commands for the preview version:

* u - undo
* r - redo
* c - display the color palette, right or left click a color to pick it for the corresponding tool
* b - display the brush size palette, right or left click to select your brush size
* 1-9 - select one of the first 9 colors in your palette for the left tool
* shift 1-9 - select one of the first 9 colors in your palette for the right tool
* z - zoom in
* shift-z - zoom out
* hold a - toggle to 100% until a is released
* shift-a - return to 100%
* g - toggle the grid
* e - save to a png in a new window
* s - save the project to local storage
* d - dump all layers to new windows (for debugging)
* i - toggle on/off the eye dropper tool
* hold spacebar - pan the image
* k - paint bucket fill tool 
* left click in image -- paint with left tool
* right click in image -- paint with right tool
* hold CTRL -- lock painting vertically or horizontally (alternates each time)
* hold ALT -- lock painting to the size of the brush (see known issues section)
* p -- publish the image to imgur (and reddit)


## How to use layers ##
Layers are modeled after most other image apps:

* click 'New' to add a new layer
* double click the name to change it
* drag layers around to reorder them
* the currently selected/highlighted layer is the active one, that is where you will paint into
* To delete a layer, click the 'X' icon next to it
* To merge a layer into the layer below it, click the down arrow icon next to it
* toggle visibility by clicking the layer's eye icon

## Palette/Color editing ##

When the color palette is open (hit 'c'), click on a color to pick it.
Click and hold to edit the color (this works for both left and right clicking, for the left and right colors). The first 9 colors have numbers in them, you can quickly select those colors by hitting
the corresponding number on your keyboard. The color palette doesn't need to be open to do this. Hold down shift then
hit a number to select that color for your right tool.  
  
Your palette gets saved with your project. Much more palette editing features are coming, stay tuned!

## Local Storage saving ##
Hitting 's' will save your current project to local storage. So far LTP is 100% done on the client, the server is doing nothing more than serving the JS/HTML/CSS files. Local storage is very limited in size in most browsers. Chrome, for example, only gives you a measly 2.5 megabytes. You can comfortably save a handful of projects, but you'll hit that 2.5mb limit quickly. So far LTP does not warn you or otherwise attempt to prevent this at all.

Server side saving is in the pipeline. I'd also like to take advantage of FileWriter once a browser supports it.

# Known Issues #
There are many. This is early code. Let's see here:

* Big initial download. Ext is a big library. I think I may move away from it...
* Dragging a large image to start a new project (or create a new layer) in Chrome can cause it to "Aww snap" crash.

# License ... #
I'm not sure what kind of license I'm going to use for LTP ultimately. For now I have chosen GPL 3, but that is (very) likely to change once this project solidifies. See the COPYING file for more info. I also chose to use Ext4, which also locks me into GPL for the moment.

# Browser Compatibility #
So far LTP only works in Chrome if on OSX (Chrome on Windows has issues). It works quite well on all platforms in Firefox 8. It does not work at all in IE or Opera, and has issues in Safari

# Help Wanted #
If you are a server side guru (rails, node.js, sinatra, django, whatever) and are interested in helping out with the back end, please contact me.
Initial goals for the back end are really simple: user authentication, and saving images (in intermediate, layer maintaining format) to the server.


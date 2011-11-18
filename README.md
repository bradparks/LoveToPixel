# LoveToPixel #
This file last updated: Nov 13, 2011

LTP is an experiment to see if I can pull off a full fledged pixel editor using JavaScript and canvas. The measure of success is if LTP ends up being a pixel editor that works so well, is responsive enough, powerful enough and enjoyable enough to use that people would seriously consider using it over a native pixel editor.

# Design Goals #
I am envisioning LTP being targeted at more advanced users. People who love to create pixel art very efficiently. The interface will almost entirely be just the main drawing window, with a mere sliver of interface at the top showing either the current palette or current brushes (depending on which mode is triggered), and a tiny status bar at the bottom. All other interactions with LTP will be handled through key commands. 

## The first set of features I'm aiming at: ##
* really good layer management (status: in place but still haven't surfaced merging, deleting, etc)
* easily set/change the left and right brushes (status: backend in place, simple front end in place)
* grid overlay (status: in place, but isn't useful yet)
* zoom in/out (status: in place)
* hold the 'a' key to temporarily zoom to 100% (once you release 'a', it returns to whatever zoom you were at) (status: in place)
* Save images in an intermediate format (maintain layers primarily) (status: in place with local storage)
* Save images as pngs (status: in place, in a simple fashion, but then again FileWriter doesn't really exist yet)
* unlimited, or at least very deep, undo/redo (status: in place for paint operations, not yet in place for anything else such as layer edits)
* A pixel pipeline which allows for things like snap to grid, lock vertical/horizontal, snap to brush size, etc (status: in place)
* Local storage support (status: in place)
* Server storage support (status: brainstorming)
* eye dropper tool (status: in place)
* paint bucket tool (status: in place, but has issues)

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

# So far... Preview at www.lovetopixel.com #
I have deployed a preview of an alpha version of LTP to http://www.lovetopixel.com  
  
Here are the key commands for the preview version:

* u - undo
* r - redo
* c - display the color palette, right or left click a color to pick it for the corresponding tool
* b - display the brush size palette, right or left click to select your brush size
* 1-9 - pick a color (for the left tool only)
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


## How to use layers ##
Layers are modeled after most other image apps:

* click 'New' to add a new layer
* the eye icon indicates if that layer is visible or not
* double click a layer to edit it (set visibility and change its name)
* drag layers around to reorder them
* the currently selected/highlighted layer is the active one, that is where you will paint into
* To delete a layer, click the 'X' icon next to it
* To merge a layer into the layer below it, click the down arrow icon next to it

## Local Storage saving ##
Hitting 's' will save your current project to local storage. So far LTP is 100% done on the client, the server is doing nothing more than serving the JS/HTML/CSS files. Local storage is very limited in size in most browsers. Chrome, for example, only gives you a measly 2.5 megabytes. You can comfortably save a handful of projects, but you'll hit that 2.5mb limit quickly. So far LTP does not warn you or otherwise attempt to prevent this at all.

Server side saving is in the pipeline. I'd also like to take advantage of FileWriter once a browser supports it.

# Known Issues #
There are many. This is early code. Let's see here:

* generally very raw, things work but not necessarily in a polished/slick way.
* editing a layer in the layer view is a bit iffy when there are only a couple of layers (the UI for editing typically scrolls up out of view, add some more layers to work around this)
* turning on the brush lock (hold down ALT while painting) is hard coded to 20 pixels
* **It's ugly!! :)** I'm focusing entirely on functionality for now. I will go back and make the app very pretty right before arriving at 1.0

# License ... #
I'm not sure what kind of license I'm going to use for LTP ultimately. For now I have chosen GPL 3, but that is (very) likely to change once this project solidifies. See the COPYING file for more info. I also chose to use Ext4, which also locks me into GPL for the moment.

# Browser Compatibility #
So far LTP only works in Chrome if on OSX (Chrome on Windows has issues). It works quite well on all platforms in Firefox 8. It does not work at all in IE or Opera, and has issues in Safari

# Help Wanted #
If you are a server side guru (rails, node.js, sinatra, django, whatever) and are interested in helping out with the back end, please contact me.
Initial goals for the back end are really simple: user authentication, and saving images (in intermediate, layer maintaining format) to the server.


# LoveToPixel #
This file last updated: Oct 23, 2011

LTP is an experiment to see if I can pull off a full fledged pixel editor using JavaScript and canvas. The measure of success is if LTP ends up being a pixel editor that works so well, is responsive enough, powerful enough and enjoyable enough to use that people would seriously consider using it over a native pixel editor.

# Design Goals #
I am envisioning LTP being targeted at more advanced users. People who love to create pixel art very efficiently. The interface will almost entirely be just the main drawing window, with a mere sliver of interface at the top showing either the current palette or current brushes (depending on which mode is triggered), and a tiny status bar at the bottom. All other interactions with LTP will be handled through key commands. 

## The first set of features I'm aiming at: ##
* really good layer management (status: in place but could use a lot of frontend polish)
* easily set/change the left and right brushes (status: backend in place, primitive front end in place)
* grid overlay (status: in place, but isn't useful yet)
* zoom in/out (status: in place)
* hold the 'a' key to temporarily zoom to 100% (once you release 'a', it returns to whatever zoom you were at) (status: in place)
* Save images in an intermediate format (maintain layers primarily) (status: not yet)
* Save images as pngs (status: in place, in a rough fashion)
* unlimited, or at least very deep, undo/redo (status: in place)
* A pixel pipeline which allows for things like snap to grid, lock vertical/horizontal, snap to brush size, etc (status: in place)
* Local storage support (status: experimenting)
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



# So far... Preview at www.lovetopixel.com #
I have deployed a preview of a very early LTP to http://www.lovetopixel.com  
  
Here are the key commands for the preview version:

* u - undo
* r - redo
* c - display the color palette, right or left click a color to pick it for the corresponding tool
* 1-9 - pick a color (for the left tool only)
* z - zoom
* hold a - return to 100% until a is released
* g - toggle the grid
* s - save to a png in a new window
* d - dump all layers to new windows (for debugging)
* i - toggle on/off the eye dropper tool
* hold spacebar - pan the image
* k - paint bucket fill tool (see known issues section)
* left click in image -- paint with left tool
* right click in image -- paint with right tool
* hold CTRL -- lock painting vertically or horizontally (alternates each time)
* hold ALT -- lock painting to the size of the brush (see known issues section)

So far LTP only works in Chrome or Safari. All other browsers will fail. This is a temporary situation.

## How to use layers ##
Layers are modeled after most other image apps:

* click 'New' to add a new layer
* the eye icon indicates if that layer is visible or not
* double click a layer to edit it (set visibility and change its name)
* drag layers around to reorder them
* the currently selected/highlighted layer is the active one, that is where you will paint into
* so far, cannot delete layers
* so far, cannot merge layers


# Known Issues #
There are many. This is very early code. Let's see here:

* generally very raw, things work but not necessarily in a polished/slick way.
* can't delete layers
* the layer manager UI is very raw and poor. The grid I chose for now is temporary
* left brush is always 20 pixels
* right brush is always 50 pixels
* no permanent save support
* the fill tool always fills blue and ignores your selected colors
* editing a layer in the layer view is a bit iffy when there are only a couple of layers (the UI for editing typically scrolls up out of view, add some more layers to work around this)
* turning on the brush lock (hold down ALT while painting) is hard coded to 20 pixels
* brushes are hard coded to 20 pixels for left brush, 50 for right.

# License ... #
I'm not sure what kind of license I'm going to use for LTP ultimately. For now I have chosen GPL 3, but that is (very) likely to change once this project solidifies. See the COPYING file for more info. I also chose to use Ext4, which also locks me into GPL for the moment.

# Browser Compatibility #
So far I can only promise it works in Chrome. I'm not convinced I'm going to stick with Ext, so I am using built in DOM/browser APIs. Once I commit to a JS framework,
I will take advantage of the cross browser abstractions they offer and LTP will work in all major browsers.

# Help Wanted #
If you are a server side guru (rails, node.js, sinatra, django, whatever) and are interested in helping out with the back end, please contact me.
Initial goals for the back end are really simple: user authentication, and saving images (in intermediate, layer maintaining format) to the server.


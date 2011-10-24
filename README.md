# LoveToPixel #
This file last updated: Oct 23, 2011

LTP is an experiment to see if I can pull off a full fledged pixel editor using JavaScript and canvas. The measure of success is if LTP ends up being a pixel editor that works so well, is responsive enough, powerful enough and enjoyable enough to use that people would seriously consider using it over a native pixel editor.

# Design Goals #
I am envisioning LTP being targeted at more advanced users. People who love to create pixel art very efficiently. The interface will almost entirely be just the main drawing window, with a mere sliver of interface at the top showing either the current palette or current brushes (depending on which mode is triggered), and a tiny status bar at the bottom. All other interactions with LTP will be handled through key commands. 

## The first set of features I'm aiming at: ##
* really good layer management (status: backend in place, needs front end)
* easily set/change the left and right brushes (status: backend in place, front end on the way)
* grid overlay (status: in place)
* zoom in/out (status: in place)
* hold the 'a' key to temporarily zoom to 100% (once you release 'a', it returns to whatever zoom you were at) (status: in place)
* Save images in an intermediate format (maintain layers primarily) (status: not yet)
* Save images as pngs (status: in place, in a rought fashion)
* unlimited, or at least very deep, undo/redo (status: in place, but has some issues)
* A pixel pipeline which allows for things like snap to grid, lock vertical/horizontal, snap to brush size, etc (status: under way)
* Local storage support (status: experimenting)
* Server storage support (status: brainstorming)
* eye dropper tool (status: in place)
* paint bucket tool (status: not yet)

## Future Features ##
* Animation support
* version control support
* color theme creation
* detailed brush editor
* copy/cut/paste regions



# So far... Preview at www.lovetopixel.com #
I have deployed a preview of a very early LTP to http://www.lovetopixel.com  
  
What is deployed there is the layerManagerSpike branch, so it does include some untested/experimental code. But overall, the layer manager is working fairly well.

Here are the key commands for the preview version:

* u - undo (see known issues section)
* r - redo (see known issues section)
* 1-9 - pick a color
* z - zoom
* hold a - return to 100% until a is released
* g - toggle the grid
* s - save to a png in a new window
* d - dump all layers to new windows (for debugging)
* i - toggle on/off the eye dropper tool
* spacebar - pan the image
* k - paint bucket fill tool
* left click in image -- paint with left tool
* right click in image -- paint with right tool
* left click a swatch in the toolbar -- set left tool to that color
* right click a swatch in the toolbar -- set right tool to that color

So far LTP only works in Chrome or Safari. All other browsers will fail. This is a temporary situation.

## How to use layers ##
Layers are modeled after most other image apps:

* click 'New' to add a new layer
* the 'V' indicates if that layer is visible or not
* double click a layer to edit it (set visibility and change its name)
* drag layers around to reorder them
* the currently selected/highlighted layer is the active one, that is where you will paint into
* so far, cannot delete layers
* so far, cannot merge layers


# Known Issues #
There are many. This is very early code. Let's see here:

* generally very raw, things work but not necessarily in a polished/slick way.
* undo/redo assume there is only ever one layer in the image. Once you go multi image undo/redo will start doing lots of wrong things
* can't delete layers
* the layer manager UI is very raw and poor. The grid I chose for now is temporary
* left brush is always 20 pixels
* right brush is always 50 pixels
* no permanent save support
* the fill tool always fills blue and ignores your selected colors
* editing a layer in the layer view is a bit iffy when there are only a couple of layers (the UI for editing typically scrolls up out of view, add some more layers to work around this)

# License ... #
I'm not sure what kind of license I'm going to use for LTP ultimately. For now I have chosen GPL 3, but that is (very) likely to change once this project solidifies. See the COPYING file for more info. I also chose to use Ext4, which also locks me into GPL for the moment.



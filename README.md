# LoveToPixel #
This file last updated: Oct 18, 2011

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


# So far... #
I've embarked on the actual app at app/index.html. If you pull that into a WebKit browser, you should find a rough but working pixel editor with many of the above features in place. Here are the current key commands:
* u - undo
* r - redo
* 1-9 - pick a color
* z - zoom
* a - return to 100%
* g - toggle the grid
* s - save to a png in a new window
* i - toggle on/off the eye dropper tool

So far LTP only works in Chrome or Safari. All other browsers will fail. This is a temporary situation.



# License ... #
I'm not sure what kind of license I'm going to use for LTP ultimately. For now I have chosen GPL 3, but that is (very) likely to change once this project solidifies. See the COPYING file for more info. I also chose to use Ext4, which also locks me into GPL for the moment.



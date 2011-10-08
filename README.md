# LoveToPixel #
This file last updated: Oct 8, 2011

LTP is an experiment to see if I can pull off a full fledged pixel editor using JavaScript and canvas. The measure of success is if LTP ends up being a pixel editor that works so well, is responsive enough, powerful enough and enjoyable enough to use that people would seriously consider using it over a native pixel editor.

# Design Goals #
I am envisioning LTP being targeted at more advanced users. People who love to create pixel art very efficiently. The interface will almost entirely be just the main drawing window, with a mere sliver of interface at the top showing either the current palette or current brushes (depending on which mode is triggered). All other interactions with LTP will be handled through key commands. 

## The first set of features I'm aiming at: ##
* really good layer management
* easily set/change the left and right brushes
* grid overlay
* zoom in/out
* hold the 'a' key to temporarily zoom to 100% (once you release 'a', it returns to whatever zoom you were at)
* Save images in an intermediate format (maintain layers primarily)
* Save images as pngs
* unlimited, or at least very deep, undo/redo

## Future Features ##
* Animation support
* version control support
* color theme creation


# So far... #
I'm building the components of the app in an exploritory way. The experiments/ directory contains the components pieced together to accomplish an intermediate goal. The zooming.html and overlaying.html experiments show some initial functionality.


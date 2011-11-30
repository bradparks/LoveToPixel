(function() {
	var _causesChange = false;
	var _cursor = 'move';

	LTP.PanningTool = function() {
		LTP.BaseTool.call(this, _causesChange, _cursor);
	};

	LTP.PanningTool.prototype = new LTP.BaseTool();

	LTP.PanningTool.prototype.perform = function(e) {
		var container = e.containerElement;

		var topDelta = e.currentPointNonTransformed.y - e.lastPointNonTransformed.y;
		var leftDelta = e.currentPointNonTransformed.x - e.lastPointNonTransformed.x;

		var newTopScroll = container.scrollTop - topDelta;
		var newLeftScroll = container.scrollLeft - leftDelta;

		container.scrollTop = newTopScroll;
		container.scrollLeft = newLeftScroll;
	};

	// get rid of default overlay (just want the cursor)
	LTP.PanningTool.prototype.overlay = function() {};
})();


(function() {
	LTP.PanningTool = function() {
	};

	LTP.PanningTool.prototype = {
		perform: function(e) {
			var container = e.containerElement;

			var topDelta = e.currentPointNonTransformed.y - e.lastPointNonTransformed.y;
			var leftDelta = e.currentPointNonTransformed.x - e.lastPointNonTransformed.x;

			var newTopScroll = container.scrollTop - topDelta;
			var newLeftScroll = container.scrollLeft - leftDelta;
			
			container.scrollTop = newTopScroll;
			container.scrollLeft = newLeftScroll;
		},

		overlay: function(context, point) {
		}
	};

	Object.defineProperty(LTP.PanningTool.prototype, "causesChange", {
		get: function() {
			return false;
		}
	});

	Object.defineProperty(LTP.PanningTool.prototype, "cursor", {
		get: function() {
			return 'move';
		},
		enumerable: true
	});

})();


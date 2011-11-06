(function() {
	LTP.PanningTool = function() {
	};

	LTP.PanningTool.prototype = {
		get causesChange() {
			return false;
		},
		perform: function p_perform(e) {
			var container = e.containerElement;

			var topDelta = e.currentPointNonTransformed.y - e.lastPointNonTransformed.y;
			var leftDelta = e.currentPointNonTransformed.x - e.lastPointNonTransformed.x;

			console.log("lp: ", e.lastPointNonTransformed.toString(), " cp: ", e.currentPointNonTransformed.toString());

			var newTopScroll = container.scrollTop - topDelta;
			var newLeftScroll = container.scrollLeft - leftDelta;
			
			container.scrollTop = newTopScroll// -= topDelta;
			container.scrollLeft = newLeftScroll;// -= leftDelta;
		},

		overlay: function p_overlay(context, point) {
			context.save();

			context.strokeStyle = colors.red;
			context.beginPath();
			
			context.moveTo(point.x, point.y + 5);
			context.lineTo(point.x - 5, point.y);
			context.lineTo(point.x, point.y - 5);
			context.lineTo(point.x + 5, point.y);
			context.lineTo(point.x, point.y + 5);
			
			context.closePath();
			context.stroke();

			context.restore();

		}
	};

})();


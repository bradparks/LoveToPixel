(function() {
	LTP.EyeDropperTool = function EyeDropperTool() {
	};

	LTP.EyeDropperTool.prototype = {
		get causesChange() {
			return false;
		},

		get sampledColor() {
			return this._sampledColor;
		},
		
		perform: function(context, lastPoint, currentPoint) {
			var pixelData = context.getImageData(currentPoint.x, currentPoint.y, 1, 1);

			this._sampledColor = this._pixelToCssString(pixelData.data);
		},

		_pixelToCssString: function(pixelData) {
			return 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ');';
		}
	};


})();

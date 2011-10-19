(function() {
	LTP.EyeDropperTool = function EyeDropperTool(messageBus) {
		this._messageBus = messageBus || LTP.GlobalMessageBus;
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

			this._messageBus.publish('colorSampled', this._sampledColor);
		},

		overlay: function edt_overlay(context, point) {
			context.save();

			context.beginPath();
			context.strokeStyle = 'gray';
			context.moveTo(point.x - 5, point.y);
			context.lineTo(point.x + 5, point.y);
			context.moveTo(point.x, point.y - 5);
			context.lineTo(point.x, point.y + 5);
			context.closePath();
			context.stroke();

			context.restore();
		},

		_pixelToCssString: function(pixelData) {
			return 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ');';
		}
	};


})();

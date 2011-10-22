(function() {
	LTP.EyeDropperTool = function EyeDropperTool(messageBus) {
		this._messageBus = messageBus || LTP.GlobalMessageBus;
	};

	LTP.EyeDropperTool.prototype = {
		get causesChange() {
			return false;
		},

		get sampledRgbColor() {
			return this._sampledRgbColor;
		},

		get sampledHexColor() {
			return this._sampledHexColor;
		},
		
		perform: function(e) {
			var context = e.context;
			var currentPoint = e.currentPoint;

			var pixelData = context.getImageData(currentPoint.x, currentPoint.y, 1, 1);

			this._sampledRgbColor = this._pixelToRgbString(pixelData.data);
			this._sampledHexColor = this._pixelToHexString(pixelData.data);

			this._messageBus.publish('colorSampled', this._sampledRgbColor, this._sampledHexColor);
		},

		overlay: function edt_overlay(context, point) {
			context.save();

			context.beginPath();
			context.strokeStyle = colors.gray;
			context.moveTo(point.x - 5, point.y);
			context.lineTo(point.x + 5, point.y);
			context.moveTo(point.x, point.y - 5);
			context.lineTo(point.x, point.y + 5);
			context.closePath();
			context.stroke();

			context.restore();
		},

		_pixelToRgbString: function(pixelData) {
			return 'rgb(' + pixelData[0] + ',' + pixelData[1] + ',' + pixelData[2] + ');';
		},

		_pixelToHexString: function(pixelData) {
			function pad(s) {
				if(s.length == 1) {
					return '0' + s;
				}
				return s;
			}

			return '#' + pad(pixelData[0].toString(16)) + pad(pixelData[1].toString(16)) + pad(pixelData[2].toString(16));
		},
	};


})();

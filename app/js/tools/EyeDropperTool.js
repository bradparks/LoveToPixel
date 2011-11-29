(function() {
	LTP.EyeDropperTool = function EyeDropperTool(messageBus) {
		this._messageBus = messageBus || LTP.GlobalMessageBus;
	};

	LTP.EyeDropperTool.prototype = {
		perform: function(e) {
			var context = e.context;
			var currentPoint = e.currentPoint;

			var pixelData = context.getImageData(currentPoint.x, currentPoint.y, 1, 1);

			this._sampledRgbColor = this._pixelToRgbString(pixelData.data);
			this._sampledHexColor = this._pixelToHexString(pixelData.data);

			this._messageBus.publish('colorSampled', this._sampledRgbColor, this._sampledHexColor, e.mouseButton);
		},

		overlay: function edt_overlay(context, point) {
			context.save();

			context.fillStyle = colors.blue;
			context.fillRect(point.x, point.y, 1, 1);

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

	Object.defineProperty(LTP.EyeDropperTool.prototype, "causesChange", {
		get: function() {
			return false;
		}
	});

	Object.defineProperty(LTP.EyeDropperTool.prototype, "sampledRgbColor", {
		get: function() {
			return this._sampledRgbColor;
		}
	});

	Object.defineProperty(LTP.EyeDropperTool.prototype, "sampledHexColor", {
		get: function() {
			return this._sampledHexColor;
		}
	});

	Object.defineProperty(LTP.EyeDropperTool.prototype, "cursor", {
		get: function() {
			return 'url(images/cursors/EyeDropper.png), auto';
		},
		enumerable: true
	});
})();


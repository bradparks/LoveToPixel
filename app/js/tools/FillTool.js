(function() {
	var _causesChange = true;
	var _cursor = 'url(images/cursors/Fill.png), auto';

	LTP.FillTool = function() {
		LTP.BaseTool.call(this, _causesChange, _cursor);
	};

	LTP.FillTool.prototype = new LTP.BaseTool();

	LTP.FillTool.prototype._sampleColorAt = function(context, point) {
		var imageData = context.getImageData(point.x, point.y, 1, 1);
		return LTP.util.toArray(imageData.data);
	};

	LTP.FillTool.prototype._areSame = function(a, b) {
		if (a === b) {
			return true;
		}

		if (a.length !== b.length) {
			return false;
		}

		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) {
				return false;
			}
		}

		return true;
	};

	LTP.FillTool.prototype.perform = function(e) {
		if (e.imageCanvas.width !== e.context.canvas.width || e.imageCanvas.height !== e.context.canvas.height) {
			throw new Error("FillTool.perform: source and dest canvases need to be the same size");
		}

		var sourceContext = e.imageCanvas.getContext('2d');

		var sampledColor = this._sampleColorAt(sourceContext, e.currentPoint);
		var targetColor = colors.fromHexToArray(e.color, {
			includeAlpha: true
		});

		if (!this._areSame(sampledColor, targetColor)) {
			this._fill(sourceContext, e.context, e.currentPoint, sampledColor, targetColor);
		}
	};

	LTP.FillTool.prototype.getBoundsAt = function(point, context) {
		return this._lastBoundingBox || r(0, 0, 0, 0);
	};

	LTP.FillTool.prototype._fill = function(sourceContext, destContext, start, sampledColor, newColor) {
		var imageData = sourceContext.getImageData(0, 0, sourceContext.canvas.width, sourceContext.canvas.height);
		var destData = destContext.getImageData(0, 0, destContext.canvas.width, destContext.canvas.height);

		var boundingBoxBuilder = new LTP.BoundingBoxBuilder();

		function colorPixel(pixelIndex) {
			destData.data[pixelIndex] = newColor[0];
			destData.data[pixelIndex + 1] = newColor[1];
			destData.data[pixelIndex + 2] = newColor[2];
			destData.data[pixelIndex + 3] = newColor[3];
		}

		function isSampledColor(pixelIndex) {
			// if we've written to destData at this location we need to return false
			if (destData.data[pixelIndex + 3] !== 0) {
				return false;
			}

			var r = imageData.data[pixelIndex];
			var g = imageData.data[pixelIndex + 1];
			var b = imageData.data[pixelIndex + 2];
			var a = imageData.data[pixelIndex + 3];

			return r === sampledColor[0] && g === sampledColor[1] && b === sampledColor[2] && a === sampledColor[3];
		}

		var pixelStack = [[start.x, start.y]];

		var newPos, x, y, pixelPos, reachLeft, reachRight;
		var canvasWidth = destContext.canvas.width;
		var canvasHeight = destContext.canvas.height;

		while (pixelStack.length) {
			newPos = pixelStack.pop();
			x = newPos[0];
			y = newPos[1];

			pixelPos = (y * canvasWidth + x) * 4;
			while (y-- >= 0 && isSampledColor(pixelPos)) {
				pixelPos -= canvasWidth * 4;
			}
			pixelPos += canvasWidth * 4; ++y;
			reachLeft = false;
			reachRight = false;
			while (y++ < canvasHeight - 1 && isSampledColor(pixelPos)) {
				colorPixel(pixelPos);
				boundingBoxBuilder.append(r(x, y, 1, 1));

				if (x > 0) {
					if (isSampledColor(pixelPos - 4)) {
						if (!reachLeft) {
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					}
					else if (reachLeft) {
						reachLeft = false;
					}
				}

				if (x < canvasWidth - 1) {
					if (isSampledColor(pixelPos + 4)) {
						if (!reachRight) {
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					}
					else if (reachRight) {
						reachRight = false;
					}
				}

				pixelPos += canvasWidth * 4;
			}
		}
		destContext.putImageData(destData, 0, 0);
		this._lastBoundingBox = boundingBoxBuilder.boundingBox;
	};
})();


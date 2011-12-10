(function() {
	var _causesChange = true;
	var _cursor = 'none';

	LTP.BrushTool = function() {
		LTP.BaseTool.call(this, _causesChange, _cursor);
	};

	LTP.BrushTool.prototype = new LTP.BaseTool();

	LTP.BrushTool.prototype.overlay = function(context, point, size) {
		context.save();
		var color = this.overlayColor || 'rgba(255, 0, 0, .5)';
		context.globalCompositeOperation = 'lighter';

		if (size < 3) {
			context.fillStyle = color;
			this._placePoint(context, point, size);
		} else {
			context.strokeStyle = color;
			context.lineWidth = 1;
			this._placePoint(context, point, size, {
				stroke: true
			});
		}

		context.restore();
	};
	LTP.BrushTool.prototype.getBoundsAt = function(point, brushSize, canvasSize) {
		return r(point.x - brushSize, point.y - brushSize, brushSize, brushSize).clipInside(r(0, 0, canvasSize.width, canvasSize.height));
	};

	LTP.BrushTool.prototype.perform = function(e) {
		var context = e.context;
		var startPoint = e.lastPoint;
		var endPoint = e.currentPoint;

		context.save();
		context.fillStyle = e.color;

		if (startPoint.equals(endPoint)) {
			this._placePoint(context, startPoint, e.size);
		} else {
			if (startPoint.x > endPoint.x) {
				var temp = startPoint;
				startPoint = endPoint;
				endPoint = temp;
			}

			var slope = (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);

			var intersect = startPoint.y - slope * startPoint.x;

			var arrived = false;
			while (!arrived) {
				this._placePoint(context, startPoint, e.size);
				var result = this._moveTowards(startPoint, endPoint, slope, intersect);
				arrived = result.arrived;
				startPoint = result.point;
			}
		}
		this._placePoint(context, endPoint, e.size);
		context.restore();
	};

	LTP.BrushTool.prototype._placePoint = function(context, point, size, options) {
		var method = options && options.stroke ? context.strokeRect: context.fillRect;
		var strokeOffset = options && options.stroke ? 0.5: 0;

		method.call(context, point.x - size - strokeOffset, point.y - size - strokeOffset, size + (2 * strokeOffset), size + (2 * strokeOffset));
	};

	LTP.BrushTool.prototype._moveTowards = function(startPoint, endPoint, slope, intersect) {
		if (slope === Infinity || slope === - Infinity) {
			if (startPoint.y === endPoint.y) {
				return {
					arrived: true,
					point: pr(startPoint.x, startPoint.y)
				};
			} else {
				var delta = slope === Infinity ? 1: - 1;
				return {
					arrived: false,
					point: pr(startPoint.x, startPoint.y + delta)
				};
			}
		}

		if (startPoint.x === endPoint.x) {
			return {
				arrived: true,
				point: pr(startPoint.x, startPoint.y)
			}
		}

		var x, y;

		if (Math.abs(slope) > 1) {
			if (endPoint.y > startPoint.y) {
				y = startPoint.y + 1;
			} else {
				y = startPoint.y - 1;
			}
			x = (y - intersect) / slope;
		} else {
			x = startPoint.x + 1;
			y = x * slope + intersect;
		}

		var result = pr(x, y);

		return {
			arrived: false,
			point: result
		}
	};
})();


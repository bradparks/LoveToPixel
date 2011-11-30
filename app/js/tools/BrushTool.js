(function() {
	LTP.BrushTool = function(size) {
		if (!size) {
			throw new Error("BrushTool: size must be specified");
		}
		this._size = size;
	};

	LTP.BrushTool.prototype = {
		overlay: function(context, point) {
			context.save();
			var color = 'rgba(255, 0, 0, .5)';
			context.globalCompositeOperation = 'lighter';

			if (this._size < 3) {
				context.fillStyle = color;
				this._placePoint(context, point);
			} else {
				context.strokeStyle = color;
				context.lineWidth = 1;
				this._placePoint(context, point, {
					stroke: true
				});
			}

			context.restore();
		},

		getBoundsAt: function(point) {
			// if x or y are negative, then outside of the canvas and should return an empty bounds
			if (point.x < 0 || point.y < 0) {
				return r(0, 0, 0, 0);
			}

			// if the point is close enough to the edge that the brush doesn't
			// fit, then need to clip it to the bounds of the canvas
			var x = Math.max(0, point.x - this._size);
			var y = Math.max(0, point.y - this._size);

			var width = point.x >= this._size ? this._size: point.x;
			var height = point.y >= this._size ? this._size: point.y;

			return r(x, y, width, height);
		},

		perform: function(e) {
			var context = e.context;
			var startPoint = e.lastPoint;
			var endPoint = e.currentPoint;

			context.save();
			context.fillStyle = e.color;

			if (startPoint.equals(endPoint)) {
				this._placePoint(context, startPoint);
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
					this._placePoint(context, startPoint);
					var result = this._moveTowards(startPoint, endPoint, slope, intersect);
					arrived = result.arrived;
					startPoint = result.point;
				}
			}
			this._placePoint(context, endPoint);
			context.restore();
		},

		_placePoint: function(context, point, options) {
			var method = options && options.stroke ? context.strokeRect: context.fillRect;
			var strokeOffset = options && options.stroke ? 0.5: 0;

			method.call(context, point.x - this._size - strokeOffset, point.y - this._size - strokeOffset, this._size + (2 * strokeOffset), this._size + (2 * strokeOffset));
		},

		_moveTowards: function(startPoint, endPoint, slope, intersect) {
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
		}
	};

	Object.defineProperty(LTP.BrushTool.prototype, "size", {
		get: function() {
			return this._size;
		}
	});

	Object.defineProperty(LTP.BrushTool.prototype, "causesChange", {
		get: function() {
			return true;
		}
	});
})();


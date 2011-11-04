(function() {
	LTP.BrushTool = function(size) {
		if(!size) {
			throw new Error("BrushTool: size must be specified");
		}

		this._size = size;
	};

	LTP.BrushTool.prototype = {
		get size() {
			return this._size;
		},

		get causesChange() {
			return true;
		},

		overlay: function bt_overlay(context, point) {
			context.save();

			if(this._size < 3) {
				context.fillStyle = 'rgba(255, 0, 0, .5)';
				this._placePoint(context, point);
			} else {
				context.strokeStyle = 'orange';
				context.lineWidth = 1;
				this._placePoint(context, point, {stroke: true});
			}

			context.restore();
		},

		getBoundsAt: function bt_getBoundsAt(point) {
			// if x or y are negative, then outside of the canvas and should return an empty bounds
			if(point.x < 0 || point.y < 0) {
				return r(0,0,0,0);
			}

			// if the point is close enough to the edge that the brush doesn't
			// fit, then need to clip it to the bounds of the canvas

			var x = Math.max(0, point.x - this._size);
			var y = Math.max(0, point.y - this._size);

			var width = point.x >= this._size ? this._size : point.x;
			var height = point.y >= this._size ? this._size : point.y;

			return r(x, y, width, height);
		},

		perform: function bt_perform(e) {
			var context = e.context;
			var startPoint = e.lastPoint;
			var endPoint = e.currentPoint;

			context.save();
			context.fillStyle = e.color;
			endPoint = startPoint;

			if(startPoint.equals(endPoint)) {
				this._placePoint(context, startPoint);
			} else {
				while(!(startPoint.equals(endPoint))) {
					this._placePoint(context, startPoint);
					startPoint = this._moveTowards(startPoint, endPoint);
				}
			}
			this._placePoint(context, endPoint);
			context.restore();
		},

		_placePoint: function bt_placePoint(context, point, options) {
			var method = options && options.stroke ? context.strokeRect : context.fillRect;
			var strokeOffset = options && options.stroke ? 0.5 : 0;

			method.call(context, point.x - this._size - strokeOffset, point.y - this._size - strokeOffset, this._size + (2*strokeOffset), this._size + (2*strokeOffset));
		},

		_moveTowards: function bt_moveTowards(start, finish) {
			if(start.equals(finish)) {
				return p(start.x, start.y);
			}

			var horizontalDistance = finish.x - start.x;
			var absHd = Math.abs(horizontalDistance);

			var verticalDistance = finish.y - start.y;
			var absVd = Math.abs(verticalDistance);

			var x, y;

			if(absHd > absVd) {
				y = start.y;
				// need to move horizontally
				if(horizontalDistance < 0) {
					x = start.x - 1;
				} else {
					x = start.x + 1;
				}
			} else  if(absHd < absVd) {
				// need to move vertically
				x = start.x;
				if(verticalDistance < 0) {
					y = start.y - 1;
				} else {
					y = start.y + 1;
				}
			} else {
				// need to move both
				if(horizontalDistance < 0) {
					x = start.x - 1;
				} else {
					x = start.x + 1;
				}
				if(verticalDistance < 0) {
					y = start.y - 1;
				} else {
					y = start.y + 1;
				}
			}
			return p(x,y);
		}
	};
})();

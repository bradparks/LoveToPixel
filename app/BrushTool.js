(function() {
	LTP.BrushTool = function(color, size) {
		if(!color) {
			throw new Error("BrushTool: color must be specified");
		}
		if(!size) {
			throw new Error("BrushTool: size must be specified");
		}

		this._color = color;
		this._size = size;
	};

	LTP.BrushTool.prototype = {
		perform: function bt_perform(context, startPoint, endPoint) {
			context.save();
			context.fillStyle = this._color;
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

		_placePoint: function bt_placePoint(context, point) {
			context.fillRect(point.x - this._size, point.y - this._size, this._size, this._size);
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

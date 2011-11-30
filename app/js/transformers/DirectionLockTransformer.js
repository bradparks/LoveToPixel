(function() {
	LTP.DirectionLockTransformer = function DirectionLockTransformer(direction) {
		if(!direction) {
			throw new Error("DirectionLockTransformer: direction is required");
		}

		this._direction = direction;
	};

	LTP.DirectionLockTransformer.directions = {
		leftRight: 'leftRight',
		upDown : 'upDown'
	};

	LTP.DirectionLockTransformer.prototype = {
		transform: function(lastPoint, currentPoint) {
			if(lastPoint.equals(currentPoint)) {
				return currentPoint;
			}

			if(this._direction === LTP.DirectionLockTransformer.directions.leftRight) {
				return p(currentPoint.x, lastPoint.y);
			}
			else if(this._direction === LTP.DirectionLockTransformer.directions.upDown) {
				return p(lastPoint.x, currentPoint.y);
			}

			// should never get here
			return currentPoint;
		},

		overlay: function(context, point) {
			context.save();
			context.fillStyle = 'blue';

			if(this._direction === LTP.DirectionLockTransformer.directions.leftRight) {
				context.fillRect(0, point.y, context.canvas.width, 1);
			}
			else if(this._direction === LTP.DirectionLockTransformer.directions.upDown) {
				context.fillRect(point.x, 0, 1, context.canvas.height);
			}

			context.restore();
		}
	}

	Object.defineProperty(LTP.DirectionLockTransformer.prototype, "transformOnHover", {
		get: function() {
			return false;
		},
		enumerable: true
	});
})();

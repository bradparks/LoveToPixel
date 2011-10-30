(function() {
	function transform(a, anchor, size) {
		return Math.round(a / size) * size + anchor;
	}

	LTP.BrushSizeLockTransformer= function BrushSizeLockTransformer(size) {
		if(!size) {
			throw new Error("BrushSizeLockTransformer: size is required");
		}
		this._size = size;
	};

	LTP.BrushSizeLockTransformer.prototype = {
		transform: function bsl_transform(lastPoint, currentPoint) {
			if(!this._anchor) {
				this._anchor = p(currentPoint.x % this._size, currentPoint.y % this._size);
				return currentPoint;
			}

			return p(transform(currentPoint.x, this._anchor.x, this._size), transform(currentPoint.y, this._anchor.y, this._size));
		},
		reset: function bsl_reset() {
			delete this._anchor;
		}
	};

})();

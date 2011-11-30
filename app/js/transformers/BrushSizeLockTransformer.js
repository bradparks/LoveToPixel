(function() {
	function transform(coordinate, size) {
		return Math.round(coordinate / size) * size;
	}

	LTP.BrushSizeLockTransformer= function BrushSizeLockTransformer() {
	};

	LTP.BrushSizeLockTransformer.prototype = {
		transform: function(lastPoint, currentPoint, size) {
			if(!size) {
				return currentPoint;
			}

			console.log('size: ' + size);

			return p(transform(currentPoint.x, size), transform(currentPoint.y, size));
		}
	};

	Object.defineProperty(LTP.BrushSizeLockTransformer.prototype, "transformOnHover", {
		get: function() {
			return true;
		},
		enumerable: true
	});

})();

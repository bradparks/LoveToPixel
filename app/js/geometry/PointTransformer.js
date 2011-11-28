(function() {
	LTP.PointTransformer = function PointTransformer(pageOffsets) {
		this._pageOffsets = pageOffsets || window;
	};

	LTP.PointTransformer.prototype = {
		transform: function(point) {
			var factor = 1 / (this.zoom);
			var offsetX = this._pageOffsets.pageXOffset * factor;
			var offsetY = this._pageOffsets.pageYOffset * factor;

			var newX = point.x * factor + offsetX;
			var newY = point.y * factor + offsetY;

			newX = Math.ceil(newX);
			newY = Math.ceil(newY);

			return p(newX, newY);
		}
	};

	Object.defineProperty(LTP.PointTransformer.prototype, "zoom", {
		get: function() {
			return this._zoom || 1;
		},
		set: function(z) {
			this._zoom = z;
		}
	});
})();


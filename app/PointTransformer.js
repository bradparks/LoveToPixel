(function() {
	LTP.PointTransformer = function PointTransformer(pageOffsets) {
		this._pageOffsets = pageOffsets || window;
	};

	LTP.PointTransformer.prototype = {
		set zoom(z) {
			this._zoom = z;
		},
		get zoom() {
			return this._zoom || 1;
		},
		transform: function pt_transform(point) {
			var factor = 1 / (this.zoom);
			var offsetX = this._pageOffsets.pageXOffset * factor;
			var offsetY = this._pageOffsets.pageYOffset * factor;

			return p(point.x * factor + offsetX, point.y * factor + offsetY);
		}
	};

})();

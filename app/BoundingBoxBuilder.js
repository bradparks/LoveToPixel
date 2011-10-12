(function() {
	LTP.BoundingBoxBuilder = function BoundingBoxBuilder(rect) {
		rect = rect || new LTP.Rectangle();

		this._minX = rect.x;
		this._maxX = rect.x + rect.width;
		this._minY = rect.y;
		this._maxY = rect.y + rect.height;
	};

	LTP.BoundingBoxBuilder.prototype = {
		get boundingBox() {
			return r(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY);
		},
		append: function bbb_append(rect) {
			if(!rect) {
				throw new Error("BoundingBoxBuilder.append: rect argument is required");
			}

			this._minX = Math.min(this._minX, rect.x);
			this._minY = Math.min(this._minY, rect.y);
			this._maxX = Math.max(this._maxX, rect.x + rect.width);
			this._maxY = Math.max(this._maxY, rect.y + rect.height);
		}
	};

})();

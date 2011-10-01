(function() {
	LTP.Size = function Size(width, height) {
		this._width = width || 0;
		this._height = height || 0;
	};

	LTP.Size.prototype = {
		get width() {
			return this._width;
		},
		get height() {
			return this._height;
		}
	};

})();

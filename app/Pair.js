(function() {
	LTP.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	LTP.Pair.prototype = {
		get width() {
			return this._a;
		},
		get height() {
			return this._b;
		},
		get x() {
			return this._a;
		},
		get y() {
			return this._b;
		}
	};

})();

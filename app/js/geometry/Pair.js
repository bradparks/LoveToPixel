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
		},
		equals: function p_equals(other) {
			if(other) {
				return (other === this) || 
					(other._a === this._a && other._b == this._b) ||
					(other.x === this._a && other.y == this._b) ||
					(other.width == this._a && other.height == this._b);
			} 
			return false;
		},
		toString: function p_toString() {
			return "[" + this._a + "," + this._b + "]";
		}
	};

})();

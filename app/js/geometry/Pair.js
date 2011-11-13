(function() {
	LTP.Pair = function Pair(a, b) {
		this._a = a || 0;
		this._b = b || 0;
	};

	LTP.Pair.prototype = {
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

	Object.defineProperty(LTP.Pair.prototype, "width", {
		get: function() {
			return this._a;
		}
	});

	Object.defineProperty(LTP.Pair.prototype, "height", {
		get: function() {
			return this._b;
		}
	});

	Object.defineProperty(LTP.Pair.prototype, "x", {
		get: function() {
			return this._a;
		}
	});

	Object.defineProperty(LTP.Pair.prototype, "y", {
		get: function() {
			return this._b;
		}
	});
})();

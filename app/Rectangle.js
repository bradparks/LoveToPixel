(function() {
	LTP.Rectangle = function Rectangle(x, y, width, height) {
		if(typeof x === 'undefined') {
			throw new Error("Rectangle: x is required");
		}

		if(typeof y === 'undefined') {
			throw new Error("Rectangle: y is required");
		}
		
		if(typeof width === 'undefined') {
			throw new Error("Rectangle: width is required");
		}

		if(typeof height === 'undefined') {
			throw new Error("Rectangle: height is required");
		}

		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	};

	LTP.Rectangle.prototype = {
		get x() {
			return this._x;
		},
		get y() {
			return this._y;
		},
		get width() {
			return this._width;
		},
		get height() {
			return this._height;
		},
		equals: function r_equals(other) {
			if(other) {
				return other === this || (other.x === this._x && other.y === this._y && other.width === this._width && other.height === this._height);
			} else {
				return false;
			}
		}
	};
})();

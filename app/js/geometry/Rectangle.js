(function() {
	LTP.Rectangle = function Rectangle(x, y, width, height) {
		this._x = x || 0;
		this._y = y || 0;
		this._width = width || 0;
		this._height = height || 0;

		if(this._x < 0 || this._y < 0 || this._width < 0 || this._height < 0) {
			throw new Error("Rectangle: negative values not allowed");
		}
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
		get hasArea() {
			return this.height * this.width > 0;
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

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
		equals: function r_equals(other) {
			if(other) {
				return other === this || (other.x === this._x && other.y === this._y && other.width === this._width && other.height === this._height);
			} else {
				return false;
			}
		}
	};

	Object.defineProperty(LTP.Rectangle.prototype, "x", {
		get: function() {
			return this._x;
		}
	});

	Object.defineProperty(LTP.Rectangle.prototype, "y", {
		get: function() {
			return this._y;
		}
	});

	Object.defineProperty(LTP.Rectangle.prototype, "width", {
		get: function() {
			return this._width;
		}
	});

	Object.defineProperty(LTP.Rectangle.prototype, "height", {
		get: function() {
			return this._height;
		}
	});

	Object.defineProperty(LTP.Rectangle.prototype, "hasArea", {
		get: function() {
			return this.height * this.width > 0;
		}
	});

})();


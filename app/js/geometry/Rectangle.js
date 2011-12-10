(function() {
	LTP.Rectangle = function Rectangle(x, y, width, height) {
		this._x = x || 0;
		this._y = y || 0;
		this._width = width || 0;
		this._height = height || 0;

		if(this._width < 0 || this._height < 0) {
			throw new Error("Rectangle: negative sizes are not allowed");
		}
	};

	LTP.Rectangle.prototype = {
		equals: function(other) {
			if(other) {
				return other === this || (other.x === this._x && other.y === this._y && other.width === this._width && other.height === this._height);
			} else {
				return false;
			}
		},

		clipInside: function(outerRect) {
			var left = Math.max(this.x, outerRect.x);
			var right = Math.min(this.x + this.width, outerRect.x + outerRect.width);

			var top = Math.max(this.y, outerRect.y);
			var bottom = Math.min(this.y + this.height, outerRect.y + outerRect.height);

			var width = right - left;
			var height = bottom - top;

			if(width > 0 && height > 0) {
				return r(left, top, width, height);
			} else {
				return r(0, 0, 0, 0);
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


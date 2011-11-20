(function() {
	LTP.ColorManager = function ColorManager(initialColors) {
		this._colors = initialColors || [colors.black, colors.white];
		this._leftColorIndex = 0;
		this._rightColorIndex = 1;
	};

	LTP.ColorManager.prototype = {
		getColorsAsString: function() {
			return this._colors.join(',');
		},

		setColorsFromString: function(colorString) {
			this._colors = colorString.split(',');

			if(this._leftColorIndex > this._colors.length - 1) {
				this._leftColorIndex = 0;
			}

			if(this._rightColorIndex > this._colors.length - 1) {
				if(this._colors.length > 1) {
					this._rightColorIndex = 1;
				} else {
					this._rightColorIndex = 0;
				}
			}
		},

		addColor: function(color) {
			if(!colors.isHexString(color)) {
				throw new Error("Attempted to add a color that is not in hex format: " + color);
			}	

			this._colors.push(color);
		},

		removeColorAt: function(index) {
			if(this._inRange(index)) {
				this._colors.splice(index, 1);
			}
		},

		redefineAt: function(index, newColor) {
			if(this._inRange(index)) {
				this._colors[index] = newColor;
			}
		},

		moveColor: function(from, to) {
			if(this._inRange(from) && this._inRange(to)) {
				var moving = this._colors.splice(from, 1);
				this._colors.splice(to, 0, moving[0]);
			}
		},

		_inRange: function(i) {
			return i >= 0 && i < this._colors.length;
		}
	};

	Object.defineProperty(LTP.ColorManager.prototype, "colors", {
		get: function() {
			return this._colors;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.ColorManager.prototype, "leftColor", {
		get: function() {
			return this._colors[this._leftColorIndex];
		},
		enumerable: true
	});

	Object.defineProperty(LTP.ColorManager.prototype, "rightColor", {
		get: function() {
			return this._colors[this._rightColorIndex];
		},
		enumerable: true
	});

})();

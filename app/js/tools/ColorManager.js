(function() {
	LTP.ColorManager = function ColorManager(initialColors, messageBus) {
		this._colors = initialColors || [colors.black, colors.white];
		this._leftColorIndex = 0;
		this._rightColorIndex = 1;

		this._messageBus = messageBus || LTP.GlobalMessageBus;
	};

	LTP.ColorManager.prototype = {
		getColorsAsString: function() {
			return this._colors.join(',');
		},

		setColorsFromString: function(colorString, defaultPalette) {
			if(!colorString) {
				this._colors = defaultPalette;
			} else {
				this._colors = colorString.split(',');
			}

			if(!this._colors || this._colors.length === 0 || (this._colors.length === 1 && !this._colors[0])) {
				this._colors = defaultPalette;
			}

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

		setLeftColorTo: function(index) {
			if(this._inRange(index)) {
				this._leftColorIndex = index;
				this._messageBus.publish('leftColorSelected', this.leftColor, this._leftColorIndex);
			}
		},

		setRightColorTo: function(index) {
			if(this._inRange(index)) {
				this._rightColorIndex = index;
				this._messageBus.publish('rightColorSelected', this.rightColor, this._rightColorIndex);
			}
		},

		addColor: function(color) {
			if(!colors.isHexString(color)) {
				throw new Error("Attempted to add a color that is not in hex format: " + color);
			}	

			this._colors.push(color);
			this._messageBus.publish('paletteContentChange');
		},

		removeColorAt: function(index) {
			if(this._inRange(index)) {
				this._colors.splice(index, 1);
				this._messageBus.publish('paletteContentChange');
			}
		},

		redefineAt: function(index, newColor) {
			if(this._inRange(index)) {
				if(this._colors[index] !== newColor) {
					this._colors[index] = newColor;
					this._messageBus.publish('paletteContentChange');
				}
			}
		},

		moveColor: function(from, to) {
			if(this._inRange(from) && this._inRange(to)) {
				var moving = this._colors.splice(from, 1);
				this._colors.splice(to, 0, moving[0]);
				this._messageBus.publish('paletteContentChange');
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


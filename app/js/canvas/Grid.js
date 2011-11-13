(function() {
	LTP.Grid = function Grid(canvasSize, color, cellSize, messageBus) {
		if(!canvasSize) {
			throw new Error("Grid: canvasSize is required");
		}
	
		this._canvasSize = canvasSize;
		this._color = color || colors.blue;
		this._cellSize = cellSize || 5;
		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._canvas = LTP.util.canvas(canvasSize);
		this._paintGrid(this._canvas, this._cellSize, this._color);
	};

	LTP.Grid.prototype = {
		destroy: function() {
			this._canvas = null;
			this._messageBus = null;
		},

		_paintGrid: function(canvas, cellSize, color) {
			var context = canvas.getContext('2d');

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.save();
			context.strokeStyle = color;
			context.beginPath();
			for(var x = 0.5; x < canvas.width; x += cellSize) {
				context.moveTo(x, 0);
				context.lineTo(x, canvas.height);
			}

			for(var y = 0.5; y < canvas.height; y += cellSize) {
				context.moveTo(0, y);
				context.lineTo(canvas.width, y);
			}

			// outer border too
			context.strokeRect(0, 0, canvas.width, canvas.height);

			context.closePath();
			context.stroke();
			context.restore();

			this._messageBus.publish('gridCellSizeChanged', cellSize);
		}
	};

	Object.defineProperty(LTP.Grid.prototype, "color", {
		get: function() {
			return this._color;
		}
	});

	Object.defineProperty(LTP.Grid.prototype, "canvasSize", {
		get: function() {
			return this._canvasSize;
		}
	});

	Object.defineProperty(LTP.Grid.prototype, "cellSize", {
		get: function() {
			return this._cellSize;
		},
		set: function(cellSize) {
			this._cellSize = cellSize;
			this._paintGrid(this._canvas, cellSize, this._color);
		}
	});

	Object.defineProperty(LTP.Grid.prototype, "canvas", {
		get: function() {
			return this._canvas;
		}
	});

	Object.defineProperty(LTP.Grid.prototype, "visible", {
		get: function() {
			return this._canvas.style.display === '';
		},
		set: function(visible) {
			if(visible) {
				this._canvas.style.display = '';
			} else {
				this._canvas.style.display = 'none'
			}
		}
	});
})();


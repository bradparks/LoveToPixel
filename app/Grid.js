(function() {
	LTP.Grid = function Grid(canvasSize, color, cellSize) {
		if(!canvasSize) {
			throw new Error("Grid: canvasSize is required");
		}
	
		this._canvasSize = canvasSize;
		this._color = color || 'blue';
		this._cellSize = cellSize || 5;

		this._canvas = LTP.util.canvas(canvasSize);
		this._paintGrid(this._canvas, this._cellSize, this._color);
	};

	LTP.Grid.prototype = {
		get color() {
			return this._color;
		},

		get canvasSize() {
			return this._canvasSize;
		},

		get cellSize() {
			return this._cellSize;
		},

		set cellSize(cellSize) {
			this._cellSize = cellSize;
			this._paintGrid(this._canvas, cellSize, this._color);
		},

		get canvas() {
			return this._canvas;
		},

		_paintGrid: function(canvas, cellSize, color) {
			var context = canvas.getContext('2d');

			context.clearRect(0, 0, canvas.width, canvas.height);

			context.save();
			context.strokeStyle = color;
			for(var x = 0.5; x < canvas.width; x += cellSize) {
				context.moveTo(x, 0);
				context.lineTo(x, canvas.height);
			}

			for(var y = 0.5; y < canvas.height; y += cellSize) {
				context.moveTo(0, y);
				context.lineTo(canvas.width, y);
			}

			context.stroke();
			context.restore();
		}
	};

})();

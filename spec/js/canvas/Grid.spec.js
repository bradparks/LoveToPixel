describe("Grid", function() {
	describe("construction", function() {
		it("should throw if no size given", function() {
			var fn = function() {
				new LTP.Grid(undefined);
			};

			expect(fn).toThrow();
		});
		it("should default to blue if no color given", function() {
			var grid = new LTP.Grid(s(1,1));

			expect(grid.color).toBe(colors.blue);
		});

		it("should default to 0 if no cell size given", function() {
			var grid = new LTP.Grid(s(1,1), colors.red);

			expect(grid.cellSize).toEqual(0);
		});

		it("should use the passed in color and canvas size", function() {
			var color = "rgba(10,10,20,.5)";
			var size = s(10, 10);

			var grid = new LTP.Grid(size, color);

			expect(grid.color).toEqual(color);
			expect(grid.canvasSize.equals(size)).toBe(true);
		});
	});

	describe("setting the grid size", function() {
		it("should paint the canvas with the specified grid size", function() {
			var color = 'rgb(255,0,0)';
			var expectedPixelData = [255, 0, 0, 255];
			var size = s(8,8);
			var cellSize = 2;

			var grid = new LTP.Grid(size, color, cellSize);

			var context = grid.canvas.getContext('2d');

			function isPixelDataEqual(pixelDataA, pixelDataB) {
				return pixelDataA[0] == pixelDataB[0] &&
					pixelDataA[1] == pixelDataB[1] &&
					pixelDataA[2] == pixelDataB[2] &&
					pixelDataA[3] == pixelDataB[3];
			}

			for(var x = 0; x < size.width; x += cellSize) {
				var pixelData = context.getImageData(x, 1, 1, 1);

				expect(isPixelDataEqual(pixelData.data, expectedPixelData)).toBe(true);
			}

			for(var y = 0; y < size.height; y += cellSize) {
				var pixelData = context.getImageData(1, y, 1, 1);

				expect(isPixelDataEqual(pixelData.data, expectedPixelData)).toBe(true);
			}
		});

		it("should repaint the canvas if the cell size is changed", function() {
			var grid = new LTP.Grid(s(10,10));

			var context = grid.canvas.getContext('2d');

			spyOn(context, "lineTo");

			grid.cellSize = 10;

			expect(context.lineTo).toHaveBeenCalled();
		});

		it("should publish a grid cell size changed message", function() {
			var message = 'gridCellSizeChanged';
			var cellSize1 = 6;
			var cellSize2 = 3;
			var callbackCount = 0;

			var callback1 = function(cellSize) {
				++callbackCount;
				expect(cellSize).toEqual(cellSize1);
			};

			var mb = new LTP.MessageBus([message]);
			mb.subscribe(message, callback1);

			var grid = new LTP.Grid(s(10, 10), colors.red, cellSize1, mb);

			mb.unsubscribe(message, callback1);

			var callback2 = function(cellSize) {
				++callbackCount;
				expect(cellSize).toEqual(cellSize2);
			};

			mb.subscribe(message, callback2);


			grid.cellSize = cellSize2;

			expect(callbackCount).toEqual(2);
		});
	});

	describe("visibility", function() {
		it("should show and hide the grid based on its visibility property", function() {
			var grid = new LTP.Grid(s(2,2), colors.red, 1);

			grid.visible = false;

			expect(grid.canvas.style.display).toBe('none');
			expect(grid.visible).toBe(false);

			grid.visible = true;

			expect(grid.canvas.style.display).toBe('');
			expect(grid.visible).toBe(true);
		});
	});
});


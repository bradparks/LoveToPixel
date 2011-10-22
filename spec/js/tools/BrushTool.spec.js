describe("BrushTool", function() {
	describe("construction", function() {
		it("should throw an error if no color or brush specified", function() {
			expect(LTP.BrushTool).toThrow();
		});

		it("should report it causes change", function() {
			var brush = new LTP.BrushTool(colors.red, 3);
			expect(brush.causesChange).toBe(true);
		});

		it("should have working getters", function() {
			var color = colors.blue;
			var size = 8;

			var brush = new LTP.BrushTool(color, size);

			expect(brush.color).toEqual(color);
			expect(brush.size).toEqual(size);
		});
	});

	describe("performing", function() {
		it("should paint into the context: simple, start and end are the same", function() {
			var canvasWidth = 3;
			var canvasHeight = 3;
			var canvas = document.createElement('canvas');
			canvas.width = canvasWidth;
			canvas.height = canvasHeight;
			var context = canvas.getContext('2d');

			var brush = new LTP.BrushTool(colors.red, canvasWidth - 1);
			
			var point = p(2,2);
			brush.perform(context, point, point);

			// [r][r][b]
			// [r][r][b]
			// [b][b][b]

			// [r][r][b][r][r][b][b][b][b]

			var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

			function getPixelData(id, index) {
				var offset = index * 4;
				var data = [];
				for(var i = offset; i < offset + 4; ++i) {
					data.push(id[i]);
				}

				return data;
			}

			expect(getPixelData(imageData.data, 0)).toEqual([255,0,0,255]);
			expect(getPixelData(imageData.data, 1)).toEqual([255,0,0,255]);
			expect(getPixelData(imageData.data, 2)).toEqual([0,0,0,0]);

			expect(getPixelData(imageData.data, 3)).toEqual([255,0,0,255]);
			expect(getPixelData(imageData.data, 4)).toEqual([255,0,0,255]);
			expect(getPixelData(imageData.data, 5)).toEqual([0,0,0,0]);

			expect(getPixelData(imageData.data, 6)).toEqual([0,0,0,0]);

			expect(getPixelData(imageData.data, 7)).toEqual([0,0,0,0]);
			expect(getPixelData(imageData.data, 8)).toEqual([0,0,0,0]);
		});
	});

	describe("getBoundsAt", function() {
		it("should return the bounds", function() {
			var size = 4;
			var brush = new LTP.BrushTool(colors.red, size);

			var x = 10, y = 20;
			var bounds = brush.getBoundsAt(p(x, y));

			expect(bounds.x).toEqual(x - size);
			expect(bounds.y).toEqual(y - size);
			expect(bounds.width).toEqual(size);
			expect(bounds.height).toEqual(size);
		});

		it("should clip the bounds", function() {
			var size = 10;
			var brush = new LTP.BrushTool('#FF0000', size);

			var x = 3, y = 4;
			var bounds = brush.getBoundsAt(p(x, y));

			expect(bounds.x).toEqual(0);
			expect(bounds.y).toEqual(0);
			expect(bounds.width).toEqual(x);
			expect(bounds.height).toEqual(y);
		});

		it("should return an empty bounds if x or y are negative", function() {
			var emptyRect = new LTP.Rectangle();

			var brush = new LTP.BrushTool(colors.red, 4);

			var bounds = brush.getBoundsAt(p(-3, 20));
			expect(bounds.equals(emptyRect)).toBe(true);

			bounds = brush.getBoundsAt(p(40, -10));
			expect(bounds.equals(emptyRect)).toBe(true);

			bounds = brush.getBoundsAt(p(-20, -30));
			expect(bounds.equals(emptyRect)).toBe(true);
		});
	});
});


describe("BrushTool", function() {
	describe("construction", function() {
		it("should throw an error if no color or brush specified", function() {
			expect(LTP.BrushTool).toThrow();
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

			var brush = new LTP.BrushTool('red', canvasWidth - 1);
			
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

});

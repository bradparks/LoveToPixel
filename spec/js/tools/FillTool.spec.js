describe("FillTool", function() {
	describe("construction", function() {
		it("should have a cursor", function() {
			var fillTool = new LTP.FillTool();
			expect(fillTool.cursor).not.toBeUndefined();
			expect(fillTool.cursor.toLowerCase().indexOf('fill') >= 0).toBe(true);
		});
	});

	describe("performing", function() {
		it("should completely fill a blank canvas", function() {
			var canvas = document.createElement('canvas');
			canvas.width = 2;
			canvas.height = 2;

			var fillTool = new LTP.FillTool();

			fillTool.perform({
				context: canvas.getContext('2d'),
				currentPoint: p(1,1),
				color: colors.red
			});

			var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

			function getPixelData(id, index) {
				var offset = index * 4;
				var data = [];
				for(var i = offset; i < offset + 4; ++i) {
					data.push(id[i]);
				}

				return data;
			}

			for(var i = 0; i < imageData.data.length / 4; ++i) {
				expect(getPixelData(imageData.data, i)).toEqual([255,0,0,255]);
			}
		});

		it("should only fill the contiguous clicked region", function() {
			var canvas = document.createElement('canvas');
			canvas.width = 2;
			canvas.height = 2;
			var sourceData = canvas.getContext('2d').getImageData(0, 0, 1, 1);
			for(var i = 0; i < sourceData.data.length; ++i) {
				sourceData.data[i] = 200;
			}
			canvas.getContext('2d').putImageData(sourceData, 0, 0); 

			var fillTool = new LTP.FillTool();

			fillTool.perform({
				context: canvas.getContext('2d'),
				currentPoint: p(1,1),
				color: colors.red
			});

			var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

			function getPixelData(id, index) {
				var offset = index * 4;
				var data = [];
				for(var i = offset; i < offset + 4; ++i) {
					data.push(id[i]);
				}

				return data;
			}

			expect(getPixelData(imageData.data, 0)).toEqual([200,200,200,200]);
			for(var i = 1; i < imageData.data.length / 4; ++i) {
				expect(getPixelData(imageData.data, i)).toEqual([255,0,0,255]);
			}
		});
	});
});

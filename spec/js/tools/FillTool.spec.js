describe("FillTool", function() {
	describe("construction", function() {
		it("should throw if no color specified", function() {
			var fn = function() {
				new LTP.FillTool();
			};

			expect(fn).toThrow();
		});

		it("should throw if color is not a hex string", function() {
			var fn = function() {
				new LTP.FillTool('red');
			};

			expect(fn).toThrow();
		});
	});

	describe("performing", function() {
		it("should throw if souce and dest canvases are not the same size", function() {
			var fn = function() {
				var sourceCanvas = document.createElement('canvas');
				sourceCanvas.width = 2;
				sourceCanvas.height = 2;
	
				var destCanvas = document.createElement('canvas');
				destCanvas.width = 30;
				destCanvas.height = 20;
	
				var fillTool = new LTP.FillTool('#FF0000');
	
				fillTool.perform({
					imageCanvas: sourceCanvas,
					context: destCanvas.getContext('2d'),
					currentPoint: p(1,1)
				});
			};

			expect(fn).toThrow();
		});

		it("should completely fill a blank canvas", function() {
			var sourceCanvas = document.createElement('canvas');
			sourceCanvas.width = 2;
			sourceCanvas.height = 2;

			var destCanvas = document.createElement('canvas');
			destCanvas.width = 2;
			destCanvas.height = 2;

			var fillTool = new LTP.FillTool('#FF0000');

			fillTool.perform({
				imageCanvas: sourceCanvas,
				context: destCanvas.getContext('2d'),
				currentPoint: p(1,1)
			});

			var imageData = destCanvas.getContext('2d').getImageData(0, 0, destCanvas.width, destCanvas.height);

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
			var sourceCanvas = document.createElement('canvas');
			sourceCanvas.width = 2;
			sourceCanvas.height = 2;
			var sourceData = sourceCanvas.getContext('2d').getImageData(0, 0, 1, 1);
			for(var i = 0; i < sourceData.data.length; ++i) {
				sourceData.data[i] = 200;
			}
			sourceCanvas.getContext('2d').putImageData(sourceData, 0, 0); 

			var destCanvas = document.createElement('canvas');
			destCanvas.width = 2;
			destCanvas.height = 2;

			var fillTool = new LTP.FillTool('#FF0000');

			fillTool.perform({
				imageCanvas: sourceCanvas,
				context: destCanvas.getContext('2d'),
				currentPoint: p(1,1)
			});

			var imageData = destCanvas.getContext('2d').getImageData(0, 0, destCanvas.width, destCanvas.height);

			function getPixelData(id, index) {
				var offset = index * 4;
				var data = [];
				for(var i = offset; i < offset + 4; ++i) {
					data.push(id[i]);
				}

				return data;
			}

			expect(getPixelData(imageData.data, 0)).toEqual([0,0,0,0]);
			for(var i = 1; i < imageData.data.length / 4; ++i) {
				expect(getPixelData(imageData.data, i)).toEqual([255,0,0,255]);
			}
		});
	});
});

describe("EyeDropperTool", function() {
	describe("construction", function() {
		it("should report it doesn't cause change", function() {
			var eye = new LTP.EyeDropperTool();

			expect(eye.causesChange).toBe(false);
		});

		it("should have a cursor", function() {
			var eye = new LTP.EyeDropperTool();
			expect(eye.cursor).not.toBeUndefined();
			expect(eye.cursor.toLowerCase().indexOf('eye') >= 0).toBe(true);
		});
	});

	describe("performing", function() {
		it("should sample the clicked on color", function() {
			var colorString = 'rgb(128,100,100);';
			var hexString = '#806464';

			var canvas = document.createElement("canvas");
			canvas.width = 2;
			canvas.height = 2;
			var context = canvas.getContext('2d');
			context.fillStyle = colorString;
			canvas.getContext('2d').fillRect(0, 0, 2, 2);

			var eye = new LTP.EyeDropperTool();

			var point = p(1,1);
			eye.perform({
				canvas: canvas,
				context: context,
				lastPoint: point,
				currentPoint: point,
				lastPointNonTransformed: point,
				currentPointNonTransformed: point,
				containerElement: {}
			});

			expect(eye.sampledRgbColor).toEqual(colorString);
			expect(eye.sampledHexColor).toEqual(hexString);
		});

		it("should publish a message upon sampling", function() {
			var callbackCalled = false;
			var colorString = 'rgb(128,100,100);';
			var hexString = '#806464';

			var callback = function(rgbColor, hexColor) {
				expect(rgbColor).toEqual(colorString);
				expect(hexColor).toEqual(hexString);
				callbackCalled = true;
			};

			var mb = new LTP.MessageBus(['colorSampled']);
			mb.subscribe('colorSampled', callback);

			var canvas = document.createElement("canvas");
			canvas.width = 2;
			canvas.height = 2;
			var context = canvas.getContext('2d');
			context.fillStyle = colorString;
			canvas.getContext('2d').fillRect(0, 0, 2, 2);

			var eye = new LTP.EyeDropperTool(mb);

			var point = p(1,1);
			eye.perform({
				canvas: canvas,
				context: context,
				lastPoint: point,
				currentPoint: point,
				lastPointNonTransformed: point,
				currentPointNonTransformed: point,
				containerElement: {}
			});

			expect(eye.sampledRgbColor).toEqual(colorString);
			expect(eye.sampledHexColor).toEqual(hexString);
			expect(callbackCalled).toBe(true);
		});
	});

});

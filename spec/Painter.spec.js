describe("Painter", function() {
	describe("set activeCanvas", function() {
		var painter = null;
		beforeEach(function() {
			painter = new LTP.Painter();
		});

		it("should add event listeners to the canvas", function() {
			var canvas = {
				addEventListener: function() {}
			};

			spyOn(canvas, "addEventListener");

			painter.activeCanvas = canvas;

			expect(canvas.addEventListener).toHaveBeenCalled();
		});

		it("should remove event listeners when switching canvases", function() {
			var firstCanvas = {
				addEventListener: function() {},
				removeEventListener: function() {}
			},
			secondCanvas = {
				addEventListener: function() {}
			};

			spyOn(firstCanvas, "addEventListener");
			spyOn(firstCanvas, "removeEventListener");
			spyOn(secondCanvas, "addEventListener");

			painter.activeCanvas = firstCanvas;
			painter.activeCanvas = secondCanvas;

			expect(firstCanvas.addEventListener).toHaveBeenCalled();
			expect(firstCanvas.removeEventListener).toHaveBeenCalled();
			expect(secondCanvas.addEventListener).toHaveBeenCalled();
		});
	});


});


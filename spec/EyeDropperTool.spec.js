describe("EyeDropperTool", function() {
	describe("construction", function() {
		it("should report it doesn't cause change", function() {
			var eye = new LTP.EyeDropperTool();

			expect(eye.causesChange).toBe(false);
		});
	});

	describe("performing", function() {
		it("should sample the clicked on color", function() {
			// TODO: it should fire a sampled event too, test for that
			var colorString = 'rgb(128,100,100);';

			var canvas = document.createElement("canvas");
			canvas.width = 2;
			canvas.height = 2;
			var context = canvas.getContext('2d');
			context.fillStyle = colorString;
			canvas.getContext('2d').fillRect(0, 0, 2, 2);

			var eye = new LTP.EyeDropperTool();

			var point = p(1,1);
			eye.perform(context, point, point);

			expect(eye.sampledColor).toEqual(colorString);
		});

	});

});

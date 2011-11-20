describe("ColorManager", function() {
	describe("construction", function() {
		it("should resort to a default black and white if no colors provided", function() {
			var colorManager = new LTP.ColorManager();

			expect(colorManager.colors[0]).toEqual(colors.black);
			expect(colorManager.colors[1]).toEqual(colors.white);
		});

		it("should set left and right colors to the first two colors", function() {
			var colorManager = new LTP.ColorManager();

			expect(colorManager.leftColor).toEqual(colors.black);
			expect(colorManager.rightColor).toEqual(colors.white);

			var color1 = colors.orange;
			var color2 = '#FAFAFA';
			var colorManager2 = new LTP.ColorManager([color1, color2]);

			expect(colorManager2.leftColor).toEqual(color1);
			expect(colorManager2.rightColor).toEqual(color2);
		});
	});

	describe("import and export", function() {
		it("should return an accurate color string", function() {
			var colorArray = [colors.green, colors.blue, colors.white, colors.red];

			var colorManager = new LTP.ColorManager(colorArray);

			var colorString = colorManager.getColorsAsString();

			var colorStringSplit = colorString.split(',');

			for(var i = 0; i < colorStringSplit.length; ++i) {
				expect(colorStringSplit[i]).toEqual(colorArray[i]);
			}
		});

		it("should set the colors from a string", function() {
			var colorArray = [colors.green, colors.orange, colors.black];
			var colorsAsString = colorArray.join(',');

			var colorManager = new LTP.ColorManager();

			colorManager.setColorsFromString(colorsAsString);

			for(var i = 0; i < colorManager.colors.length; ++i) {
				expect(colorManager.colors[i]).toEqual(colorArray[i]);
			}
		});
	});

	describe("color management", function() {
		it("should add a color", function() {
			var colorManager = new LTP.ColorManager([colors.red]);

			expect(colorManager.colors.length).toBe(1);

			colorManager.addColor(colors.green);
			expect(colorManager.colors.length).toBe(2);
			expect(colorManager.colors[1]).toEqual(colors.green);
		});

		it("should delete a color", function() {
			var colorArray = [colors.red, colors.green, colors.orange, colors.black];
			var expectedColorArray = [colors.red, colors.green, colors.black];

			var colorManager = new LTP.ColorManager(colorArray);

			colorManager.removeColorAt(2);

			expect(colorManager.colors.length).toEqual(expectedColorArray.length);
			for(var i = 0; i < colorManager.colors.length; ++i) {
				expect(colorManager.colors[i]).toEqual(expectedColorArray[i]);
			}
		});

		it("should redefine a color", function() {
			var colorArray = [colors.red, colors.orange];
			var colorManager = new LTP.ColorManager(colorArray);

			colorManager.redefineAt(1, colors.blue);

			expect(colorManager.colors[1]).toEqual(colors.blue);
		});

		it("should move the color", function() {
			var colorArray = [colors.green, colors.red, colors.orange, colors.blue];
			var expectedColorArray = [colors.green, colors.orange, colors.blue, colors.red];

			var colorManager = new LTP.ColorManager(colorArray);
			colorManager.moveColor(1, 3);

			for(var i = 0; i < expectedColorArray.length; ++i) {
				expect(colorManager.colors[i]).toEqual(expectedColorArray[i]);
			}
		});
	});
});



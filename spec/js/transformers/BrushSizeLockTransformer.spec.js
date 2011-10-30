describe("BrushSizeLockTransformer", function() {
	describe("construction", function() {
		it("should throw if constructed without a size", function() {
			var fn = function() {
				new LTP.BrushSizeLockTransformer();
			}
			expect(fn).toThrow();
		});
	});

	describe("transforming", function() {
		it("should return the first point passed in as is", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer(size);
			var currentPoint = p(12, 23);

			var transformed = transformer.transform(currentPoint, currentPoint);

			expect(transformed.equals(currentPoint)).toBe(true);
		});

		it("should shift the point by the first anchor correctly", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer(size);
			var firstPoint = p(12, 23);

			transformer.transform(firstPoint, firstPoint);

			var secondPoint = p(24, 32);

			var transformed = transformer.transform(secondPoint, secondPoint);

			expect(transformed.x % size).toEqual(firstPoint.x % size);
			expect(transformed.y % size).toEqual(firstPoint.y % size);
		});

		it("should transform the point based on brush size", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer(size);
			var firstPoint = p(12, 23);

			transformer.transform(firstPoint, firstPoint);

			var secondPoint = p(24, 32);
			var expectedPoint = p(32, 43);

			var transformed = transformer.transform(secondPoint, secondPoint);
			expect(transformed.x).toEqual(expectedPoint.x);
			expect(transformed.y).toEqual(expectedPoint.y);
		});

		it("should handle points before size correctly", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer(size);
			var firstPoint = p(3, 4);

			transformer.transform(firstPoint, firstPoint);

			var secondPoint = p(4, 5);
			var expectedPoint = p(3, 4);

			var transformed = transformer.transform(secondPoint, secondPoint);
			expect(transformed.x).toEqual(expectedPoint.x);
			expect(transformed.y).toEqual(expectedPoint.y);

			var thirdPoint = p(12, 14);
			expectedPoint = p(23, 24);
			transformed = transformer.transform(thirdPoint, thirdPoint);
			expect(transformed.x).toEqual(expectedPoint.x);
			expect(transformed.y).toEqual(expectedPoint.y);
		});
	});

});


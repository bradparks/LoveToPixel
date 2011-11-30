describe("BrushSizeLockTransformer", function() {
	describe("transforming", function() {
		it("should transform the point based on brush size", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer();

			var point = p(24, 32);
			// it should round up, so y will jump into the next bucket
			var expectedPoint = p(20, 40);

			var transformed = transformer.transform(point, point, size);
			expect(transformed.x).toEqual(expectedPoint.x);
			expect(transformed.y).toEqual(expectedPoint.y);
		});

		it("should handle points before size correctly", function() {
			var size = 20;
			var transformer = new LTP.BrushSizeLockTransformer(size);

			var point = p(4, 5);
			var expectedPoint = p(0, 0);

			var transformed = transformer.transform(point, point, size);
			expect(transformed.x).toEqual(expectedPoint.x);
			expect(transformed.y).toEqual(expectedPoint.y);
		});
	});

});


describe("DirectionLockTransformer", function() {
	describe("construction", function() {
		it("should throw if no direction passed in", function() {
			var fn = function() {
				new LTP.DirectionLockTransformer();
			};

			expect(fn).toThrow();
		});
	});

	describe("transforming", function() {
		it("should lock to vertical", function() {
			var transformer = new LTP.DirectionLockTransformer(LTP.DirectionLockTransformer.directions.upDown);

			var lastPoint = p(12, 30);
			var currentPoint = p(16, 40);

			var transformed = transformer.transform(lastPoint, currentPoint);

			expect(transformed.x).toEqual(lastPoint.x);
			expect(transformed.y).toEqual(currentPoint.y);
		});

		it("should lock to horizontal", function() {
			var transformer = new LTP.DirectionLockTransformer(LTP.DirectionLockTransformer.directions.leftRight);

			var lastPoint = p(12, 30);
			var currentPoint = p(16, 40);

			var transformed = transformer.transform(lastPoint, currentPoint);

			expect(transformed.y).toEqual(lastPoint.y);
			expect(transformed.x).toEqual(currentPoint.x);
		});
	});

});

describe("BoundingBoxBuilder", function() {
	describe("construction", function() {
		it("should not require a rectangle argument", function() {
			var bbb = new LTP.BoundingBoxBuilder();

			expect(bbb).toBeDefined();
			
			var boundingBox = bbb.boundingBox;

			expect(boundingBox.equals(r(0,0,0,0))).toBe(true);
		});

		it("should begin with the passed in rectangle", function() {
			var rect = r(4,5,6,7);

			var bbb = new LTP.BoundingBoxBuilder(rect);

			var boundingBox = bbb.boundingBox;

			expect(boundingBox.equals(rect)).toBe(true);
		});
	});

	describe("append", function() {
		it("should require an argument", function() {
			var fn = function() {
				var bbb = new LTP.BoundingBoxBuilder();
				bbb.append();
			};

			expect(fn).toThrow();
		});

		it("shouldn't be affected by a smaller append", function() {
			var rect = r(1, 1, 100, 100);
			var bbb = new LTP.BoundingBoxBuilder(rect);

			bbb.append(r(3,3,10,10));

			var boundingBox = bbb.boundingBox;

			expect(boundingBox.equals(rect)).toBe(true);
		});

		it("should grow to accomodate a bigger append", function() {
			var rect = r(30, 30, 10, 10);

			var bbb = new LTP.BoundingBoxBuilder(rect);

			bbb.append(r(25, 25, 5, 5));

			expect(bbb.boundingBox.equals(r(25, 25, 15, 15))).toBe(true);
		});
	});
});

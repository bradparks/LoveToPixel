describe("Rectangle", function() {
	describe("construction", function() {
		it("should set any missing arguments to zero", function() {
			var rect = new LTP.Rectangle();

			expect(rect.x).toBe(0);
			expect(rect.y).toBe(0);
			expect(rect.width).toBe(0);
			expect(rect.height).toBe(0);

			var x = 3;
			var rect2 = new LTP.Rectangle(x);
			expect(rect2.x).toEqual(x);
			expect(rect2.y).toBe(0);
			expect(rect2.width).toBe(0);
			expect(rect2.height).toBe(0);

			var y = 4;
			var rect3 = new LTP.Rectangle(undefined, y);
			expect(rect3.x).toBe(0);
			expect(rect3.y).toEqual(y);
			expect(rect3.width).toBe(0);
			expect(rect3.height).toBe(0);
		});

		it("should throw if given negative parameters", function() {
			var negX = function() {
				new LTP.Rectangle(-3);
			};

			expect(negX).toThrow();

			var negY = function() {
				new LTP.Rectangle(4, -6);
			};

			expect(negY).toThrow();

			var negW = function() {
				new LTP.Rectangle(4, 7, -9);
			};

			expect(negW).toThrow();

			var negH = function() {
				new LTP.Rectangle(3,4,5,-6);
			};

			expect(negH).toThrow();
		});

		it("should set its properties", function() {
			var x = 3;
			var y = 4;
			var w = 6;
			var h = 12;

			var rect = new LTP.Rectangle(x, y, w, h);

			expect(rect.x).toEqual(x);
			expect(rect.y).toEqual(y);
			expect(rect.width).toEqual(w);
			expect(rect.height).toEqual(h);
		});
	});

	describe("r utility method", function() {
		it("should work with numbers", function() {
			var x = 2, y = 4, w = 12, h = 15;

			var rect = LTP.r(x, y, w, h);

			expect(rect.x).toEqual(x);
			expect(rect.y).toEqual(y);
			expect(rect.width).toEqual(w);
			expect(rect.height).toEqual(h);

			var rect2 = r(x, y, w, h);

			expect(rect2.x).toEqual(x);
			expect(rect2.y).toEqual(y);
			expect(rect2.width).toEqual(w);
			expect(rect2.height).toEqual(h);
		});

		it("should work with a pair", function() {
			var x = 2, y = 5, w = 55, h = 23;

			var rect = r(p(x, y), w, h);

			expect(rect.x).toEqual(x);
			expect(rect.y).toEqual(y);
			expect(rect.width).toEqual(w);
			expect(rect.height).toEqual(h);
		});
	});

	describe("equals", function() {
		it("should not be equal to null or undefined", function() {
			var rect = r(3,4,5,6);

			expect(rect.equals(null)).toBe(false);
			expect(rect.equals(undefined)).toBe(false);
		});

		it("should not be equal to a rectangle that is not equivalent", function() {
			var rect1 = r(3,4,5,6);
			var rect2 = r(6,3,4,88);

			expect(rect1.equals(rect2)).toBe(false);
			expect(rect2.equals(rect1)).toBe(false);
		});

		it("should be equal to itself", function() {
			var rect = r(3,45,6,7);

			expect(rect.equals(rect)).toBe(true);
		});

		it("should be equal to another rectangle that is equivalent", function() {
			var rect1 = r(3,4,5,6);
			var rect2 = r(3,4,5,6);

			expect(rect1 === rect2).toBe(false);
			expect(rect1.equals(rect2)).toBe(true);
		});

		it("should be equal to an object that is equivalent", function() {
			var x = 3, y = 12, w = 44, h = 122;

			var rect = r(x,y,w,h);
			var obj = {
				x: x,
				y: y,
				width: w,
				height: h
			};

			expect(rect.equals(obj)).toBe(true);
		});
	});
});

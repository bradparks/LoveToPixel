describe("Pair", function() {

	describe("construction", function() {
		it("should default to 0x0", function() {
			var pair = new LTP.Pair();
			expect(pair.width).toEqual(0);
			expect(pair.height).toEqual(0);
		});

		it("should set itself to the constructor args", function() {
			var w = 7;
			var h = 12;

			var pair = new LTP.Pair(w,h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
		});
	});

	describe("mutability", function() {
		it("should be immutable", function() {
			var w = 7, h = 12, pair = new LTP.Pair(w,h);
			pair.width = 44;
			pair.height = 1222;

			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
		});
	});

	describe("equals", function() {
		it("should be equal to itself", function() {
			var pair = new LTP.Pair(3, 4);

			expect(pair.equals(pair)).toEqual(true);
		});

		it("should equal another pair with the same points", function() {
			var pair1 = new LTP.Pair(3,5);
			var pair2 = new LTP.Pair(3,5);

			expect(pair1.equals(pair2)).toEqual(true);
		});

		it("should not be equal to another pair with different points", function() {
			var pair1 = new LTP.Pair(3,5);
			var pair2 = new LTP.Pair(4,9);

			expect(pair1.equals(pair2)).toEqual(false);
		});

		it("should not be equal to null", function() {
			var pair1 = new LTP.Pair(3,4);

			expect(pair1.equals(null)).toEqual(false);
		});

		it("should not be equal to undefined", function() {
			var pair1 = new LTP.Pair(3,4);

			expect(pair1.equals(undefined)).toEqual(false);
		});

		it("should be equal to an equivalent point object", function() {
			var pair1 = new LTP.Pair(3,4);

			expect(pair1.equals({ x: 3, y: 4})).toEqual(true);
		});

		it("should be equal to an equivalent size object", function() {
			var pair1 = new LTP.Pair(3,4);

			expect(pair1.equals({ width: 3, height: 4})).toEqual(true);
		});
	});

	describe("utility functions", function() {
		it("LTP.s should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = LTP.s(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});
		it("s should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = s(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});
		it("LTP.p should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = LTP.p(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});
		it("p should create a pair object", function() {
			var w = 44;
			var h = 22;
			var pair = p(w, h);
			expect(pair.width).toEqual(w);
			expect(pair.height).toEqual(h);
			expect(typeof pair).toEqual('object');
		});
		
	});

});


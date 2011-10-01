describe("Size", function() {

	describe("construction", function() {
		it("should default to 0x0", function() {
			var size = new LTP.Size();
			expect(size.width).toEqual(0);
			expect(size.height).toEqual(0);
		});

		it("should set itself to the constructor args", function() {
			var w = 7;
			var h = 12;

			var size = new LTP.Size(w,h);
			expect(size.width).toEqual(w);
			expect(size.height).toEqual(h);
		});
	});

	describe("mutability", function() {
		it("should be immutable", function() {
			var w = 7, h = 12, size = new LTP.Size(w,h);
			size.width = 44;
			size.height = 1222;

			expect(size.width).toEqual(w);
			expect(size.height).toEqual(h);
		});
	});

	describe("utility functions", function() {
		it("LTP.s should create a size object", function() {
			var w = 44;
			var h = 22;
			var size = LTP.s(w, h);
			expect(size.width).toEqual(w);
			expect(size.height).toEqual(h);
			expect(typeof size).toEqual('object');
		});
		it("s should create a size object", function() {
			var w = 44;
			var h = 22;
			var size = s(w, h);
			expect(size.width).toEqual(w);
			expect(size.height).toEqual(h);
			expect(typeof size).toEqual('object');
		});
	});

});


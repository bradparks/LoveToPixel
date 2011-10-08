describe("PointTransformer", function() {
	describe("transforming", function() {
		it("should return a zoom of 1 if its not set", function() {
			var pointTransformer = new LTP.PointTransformer();
			expect(pointTransformer.zoom).toBe(1);
		});
		it("should return an equivalent point when everything is default", function() {
			var x = 4;
			var y = 6;
			var originalPoint = p(x,y);

			var transformedPoint = new LTP.PointTransformer().transform(originalPoint);

			expect(transformedPoint.x).toEqual(x);
			expect(transformedPoint.y).toEqual(y);
		});

		it("should return a point accounting for zoom", function() {
			var originalPoint = p(20, 40);
			var zoom = 2;

			var expectedPoint = p(originalPoint.x * (1/zoom), originalPoint.y * (1/zoom));

			var pointTransformer = new LTP.PointTransformer();
			pointTransformer.zoom = zoom;

			var transformedPoint = pointTransformer.transform(originalPoint);
			expect(transformedPoint.x).toEqual(expectedPoint.x);
			expect(transformedPoint.y).toEqual(expectedPoint.y);
		});

		it("should return a point accounting for scroll", function() {
			var originalPoint = p(20, 40);
			var scrollX = 10;
			var scrollY = 10;
			
			var expectedPoint = p(originalPoint.x + scrollX, originalPoint.y + scrollY);

			var pageOffsets = {
				pageXOffset : scrollX,
				pageYOffset : scrollY
			};

			var pointTransformer = new LTP.PointTransformer(pageOffsets);
			var transformedPoint = pointTransformer.transform(originalPoint);

			expect(transformedPoint.x).toEqual(expectedPoint.x);
			expect(transformedPoint.y).toEqual(expectedPoint.y);
		});

		it("should return a point accounting for scroll and zoom", function() {
			var originalPoint = p(20, 40);
			var scrollX = 10;
			var scrollY = 10;
			var zoom = 2;
			var factor = 1 / zoom;
			
			var expectedPoint = p(originalPoint.x * factor + (scrollX * factor), originalPoint.y * factor + (scrollY * factor));

			var pageOffsets = {
				pageXOffset : scrollX,
				pageYOffset : scrollY
			};

			var pointTransformer = new LTP.PointTransformer(pageOffsets);
			pointTransformer.zoom = zoom;
			var transformedPoint = pointTransformer.transform(originalPoint);

			expect(transformedPoint.x).toEqual(expectedPoint.x);
			expect(transformedPoint.y).toEqual(expectedPoint.y);
		});
	});
});


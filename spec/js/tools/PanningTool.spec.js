describe("PanningTool", function() {
	describe("performing", function() {
		it("should not cause change", function() {
			var p = new LTP.PanningTool();

			expect(p.causesChange).toBe(false);
		});

		it("should have a cursor", function() {
			var p = new LTP.PanningTool();

			expect(p.cursor).not.toBeUndefined();
			expect(p.cursor).toEqual('move');
		});

		it("should pan the container element", function() {

			var startTop = 100;
			var startLeft = 80;
		
			var div = {
				scrollTop: startTop,
				scrollLeft: startLeft
			};

			var firstPoint = p(20, 20);
			var secondPoint = p(30, 40);

			var expectedScrollTopDelta = secondPoint.y - firstPoint.y;
			var expectedScrollLeftDelta = secondPoint.x - firstPoint.x;

			var panningTool = new LTP.PanningTool();

			panningTool.perform({
				containerElement: div,
				lastPointNonTransformed: firstPoint,
				currentPointNonTransformed: secondPoint
			});

			expect(div.scrollTop + expectedScrollTopDelta).toEqual(startTop);
			expect(div.scrollLeft + expectedScrollLeftDelta).toEqual(startLeft);
		});
	});

});

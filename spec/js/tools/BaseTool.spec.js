describe("BaseTool", function() {
	describe("construction", function() {
		it("should have a cursor property", function() {
			var expectedCursor = 'testCursor';
			var tool = new LTP.BaseTool(undefined, expectedCursor);

			expect(tool.cursor).toEqual(expectedCursor);
		});

		it("should have a causesChange property", function() {
			var expectedCausesChange = true;

			var tool = new LTP.BaseTool(expectedCausesChange);

			expect(tool.causesChange).toEqual(expectedCausesChange);
		});
	});

	describe("inheritance", function() {
		it("should inherit as expected", function() {
			var expectedCausesChange = true;
			var expectedCursor = 'testTool';
			var SubclassTool = function() {
				LTP.BaseTool.call(this, expectedCausesChange, expectedCursor);
			};
			SubclassTool.prototype = new LTP.BaseTool();

			var tool = new SubclassTool();

			expect(tool.cursor).toEqual(expectedCursor);
			expect(tool.causesChange).toEqual(expectedCausesChange);
		});
	});
});


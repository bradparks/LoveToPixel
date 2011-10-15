describe("Painter", function() {
	var mockSize = p(10,10);
	var mockPointTransformer = {
		transform: function(point) { return point; }
	};

	describe("construction", function() {
		it("should throw if not given a size", function() {
			var fn = function() {
				new LTP.Painter(null, mockPaintTransformer);
			};

			expect(fn).toThrow();
		});

		it("should throw if not given a pointTransformer", function() {
			var fn = function() {
				new LTP.Painter(p(1,1), null);
			};
			expect(fn).toThrow();
		});

		it("should create an overlay", function() {
			var width = 20;
			var height = 30;

			var size = p(width, height);

			var painter = new LTP.Painter(size, mockPointTransformer);

			var overlay = painter.overlay;

			expect(overlay).toBeDefined();
			expect(overlay.width).toEqual(width);
			expect(overlay.height).toEqual(height);
		});
	});

	describe("painting", function() {
		it("should invoke the tool on mouse down", function() {
			var tool = {
				perform: function() {},
				overlay: function() {},
				getBoundsAt: function() { return r(1,2,4,5); }
			};

			var painter = new LTP.Painter(p(20,20), mockPointTransformer);
			var canvas = document.createElement('canvas');
			canvas.width = 20;
			canvas.height = 20;
			painter.activeCanvas = canvas;

			painter.leftTool = tool;

			var e = {
				preventDefault: function() {},
				button: 0,
				clientX : 10,
				clientY: 10
			};

			spyOn(e, "preventDefault");
			spyOn(tool, "perform");
			spyOn(tool, "overlay");
			
			painter._onMouseDown(e);

			expect(e.preventDefault).toHaveBeenCalled();
			expect(tool.perform).toHaveBeenCalled();
			expect(tool.overlay).toHaveBeenCalled();
		});	

		it("should completely prevent the context menu", function() {
			var painter = new LTP.Painter(mockSize, mockPointTransformer);
			
			var e = {
				preventDefault: function() {},
				stopPropagation: function() {}
			};

			spyOn(e, "preventDefault");
			spyOn(e, "stopPropagation");

			var result = painter._onContextMenu(e);

			expect(result).toBe(false);

			expect(e.preventDefault).toHaveBeenCalled();
			expect(e.stopPropagation).toHaveBeenCalled();
		});
	});

	describe("tool management", function() {
		it("should properly handle an override tool", function() {
			var painter = new LTP.Painter(s(20, 20), mockPointTransformer);

			var tool1 = { id: 'tool1' };
			var tool2 = { id: 'tool2' };

			painter.leftTool = tool1;
			expect(painter.leftTool).toEqual(tool1);

			painter.pushOverrideTool(tool2);

			expect(painter.leftTool).toEqual(tool2);
			expect(painter.rightTool).toEqual(tool2);

			painter.popOverrideTool();

			expect(painter.leftTool).toEqual(tool1);
			expect(painter.rightTool).not.toBeDefined();
		});
	});
});


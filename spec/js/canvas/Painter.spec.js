describe("Painter", function() {
	var messages = [
		'zoomChanged', 
		'leftToolChanged',
		'rightToolChanged',
		'activeLayerChanged',
		'leftColorSelected',
		'rightColorSelected',
		'canvasMouseCoordinatesChanged',
		'leftSizeSelected',
		'rightSizeSelected'
	];

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

		it("should default to 8 pixel black/white if constructed without tools specified", function() {
			var painter = new LTP.Painter(s(3,3), mockPointTransformer);

			expect(painter._leftToolState.color).toBe(colors.black);
			expect(painter._leftToolState.size).toBe(8);

			expect(painter._rightToolState.color).toBe(colors.white);
			expect(painter._rightToolState.size).toBe(8);
		});

		it("should take in the left and right tools", function() {
			var leftTool = { id: 'leftTool'};
			var rightTool = { id: 'rightTool' };

			var painter = new LTP.Painter(s(3,3), mockPointTransformer, null, leftTool, rightTool);

			expect(painter.leftTool).toEqual(leftTool);
			expect(painter.rightTool).toEqual(rightTool);
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
			
			var outerDiv = document.createElement('div');
			var innerDiv = document.createElement('div');
			outerDiv.appendChild(innerDiv);
			Ext.getBody().appendChild(outerDiv);

			var canvas = document.createElement('canvas');
			innerDiv.appendChild(canvas);

			canvas.width = 20;
			canvas.height = 20;
			painter.activeCanvas = canvas;

			painter.leftTool = tool;

			var e = {
				preventDefault: function() {},
				button: 0,
				target: canvas,
				getX: function() { return 0; },
				getY: function() { return 0; }
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

	describe("messaging", function() {
		it("should listen to the zoomChanged message and set the point transformer accordingly", function() {
			var pt = new LTP.PointTransformer();
			var mb = new LTP.MessageBus(messages);

			var painter = new LTP.Painter(s(20, 20), pt, mb);

			var newZoom = 3;

			mb.publish('zoomChanged', newZoom);

			expect(pt.zoom).toEqual(newZoom);
		});

		it("should publish messages on tool changes", function() {
			var callbackCount = 0;
			var leftTool1 = { id: 'leftTool1' };
			var leftTool2 = { id: 'leftTool2' };
			var rightTool1 = { id: 'rightTool1' };
			var rightTool2 = { id: 'rightTool2' };

			var leftCallback1 = function(tool) {
				expect(tool).toEqual(leftTool1);
				callbackCount++;
			};

			var rightCallback1 = function(tool) {
				expect(tool).toEqual(rightTool1);
				callbackCount++;
			};

			var leftCallback2 = function(tool) {
				expect(tool).toEqual(leftTool2);
				callbackCount++;
			};

			var rightCallback2 = function(tool) {
				expect(tool).toEqual(rightTool2);
				callbackCount++;
			};

			var mb = new LTP.MessageBus(messages);

			mb.subscribe('leftToolChanged', leftCallback1);
			mb.subscribe('rightToolChanged', rightCallback1);

			var painter = new LTP.Painter(s(4,4), mockPointTransformer, mb, leftTool1, rightTool1);

			mb.unsubscribe('leftToolChanged', leftCallback1);
			mb.unsubscribe('rightToolChanged', rightCallback1);
			mb.subscribe('leftToolChanged', leftCallback2);
			mb.subscribe('rightToolChanged', rightCallback2);

			painter.leftTool = leftTool2;
			painter.rightTool = rightTool2;

			expect(callbackCount).toBe(4);
		});

		it("should set the current tool when a color is selected", function() {
			var leftTool = { id: 'leftTool1' };
			var rightTool = { id: 'rightTool1' };

			var mb = new LTP.MessageBus(messages);

			var painter = new LTP.Painter(s(4,4), mockPointTransformer, mb, leftTool, rightTool);

			mb.publish('rightColorSelected');
			expect(painter._lastToolState.tool).toBe(rightTool);

			mb.publish('leftColorSelected');
			expect(painter._lastToolState.tool).toBe(leftTool);
		});
	});
});


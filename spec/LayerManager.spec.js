describe("LayerManager", function() {
	
	describe("construction", function() {
		it("should throw if no size provided", function() {
			expect(LTP.LayerManager).toThrow();
		});

		it("should set to the passed in size", function() {
			var size = s(40, 50);
			var layerManager = new LTP.LayerManager(size);

			expect(layerManager.size).toEqual(size);
		});

		it("should be immutable in regards to size", function() {
			var setSize = s(20, 30);
			var layerManager = new LTP.LayerManager(setSize);

			layerManager.size = s(22, 99);

			expect(layerManager.size).toEqual(setSize);
		});

		it("should get constructed with an initial background layer", function() {
			var size = s(12,34);
			var layerManager = new LTP.LayerManager(size);

			expect(layerManager.count).toEqual(1);

			var activeLayer = layerManager.activeLayer;
			expect(activeLayer).toBeDefined();
			expect(activeLayer).not.toBeNull();
			expect(activeLayer.width).toEqual(size.width);
			expect(activeLayer.height).toEqual(size.height);
			expect(activeLayer.layerName).toEqual(LTP.LayerManager.prototype.BaseLayerName);
			expect(activeLayer.isVisible).toEqual(true);
		});
	});

	describe("layer manipulation", function() {
		var size = null;
		var layerManager = null;

		beforeEach(function() {
			size = s(30,40);
			layerManager = new LTP.LayerManager(size);
		});
		
		it("should create a new layer", function() {
			var newLayerName = "myNewLayer";
			var resultOfAddNewLayer = layerManager.addNewLayer(newLayerName);

			expect(layerManager.count).toEqual(2);
			
			var activeLayer = layerManager.activeLayer;

			expect(activeLayer.layerName).toEqual(newLayerName);
			expect(activeLayer.isVisible).toEqual(true);

			// addNewLayer should return the newly created layer
			expect(resultOfAddNewLayer).toEqual(activeLayer);
		});

		it("should change the active layer", function() {
			var newLayerName = "newLayer";

			layerManager.addNewLayer(newLayerName);

			var activeLayer = layerManager.activeLayer;
			expect(activeLayer.layerName).toEqual(newLayerName);

			layerManager.setActiveLayer(0);
			activeLayer = layerManager.activeLayer;
			expect(activeLayer.layerName).not.toEqual(newLayerName);
			expect(activeLayer.layerName).toEqual(layerManager.BaseLayerName);
		});

		it("should throw an error if attempt to set active layer outside of range", function() {
			layerManager.addNewLayer('newLayer');

			var fn = function() {
				layerManager.setActiveLayer(4);
			};

			expect(fn).toThrow();
		});

		it("should throw an exception if attempt to delete the last layer", function() {
			var fn = function() {
				layerManager.deleteLayer(0);
			};

			expect(layerManager.deleteLayer).toBeDefined();
			expect(fn).toThrow();
		});

		it("should throw an exception if delete index is outside of range", function() {
			layerManager.addNewLayer("newLayer");
			
			var fn = function() {
				layerManager.deleteLayer(3);
			};

			expect(fn).toThrow();
		});

		it("should delete a layer", function() {
			var addedLayerName = "addedLayer";

			layerManager.addNewLayer(addedLayerName);
			expect(layerManager.count).toEqual(2);
			layerManager.deleteLayer(0);
			expect(layerManager.count).toEqual(1);
			expect(layerManager.activeLayer.layerName).toEqual(addedLayerName);
			expect(layerManager.activeLayer.isVisible).toEqual(true);
		});
	});

	describe("compositing", function() {
		function drawPixel(context, color, x, y) {
			context.save();
				context.fillStyle = color;
				context.fillRect(x, y, 1, 1);
			context.restore();
		}

		it("should return a composited canvas", function() {
			var layerManager = new LTP.LayerManager(s(2,1));

			var context1 = layerManager.activeLayer.getContext('2d');
			var context2 = layerManager.addNewLayer("layer2").getContext('2d');

			drawPixel(context1, "red", 0, 0);
			drawPixel(context2, "blue", 1, 0);

			var composited = layerManager.composite().getContext('2d');

			var imageData = composited.getImageData(0,0,2,1);
			expect(imageData.data[0]).toEqual(255);
			expect(imageData.data[1]).toEqual(0);
			expect(imageData.data[2]).toEqual(0);
			expect(imageData.data[3]).toEqual(255);
		});
	});

});


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

	describe("layer creation", function() {
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

		it("should create a new layer that is fully transparent", function() {
			size = s(2,2);
			layerManager = new LTP.LayerManager(size);

			var layer = layerManager.addNewLayer('new layer');

			var imageData = layer.getContext('2d').getImageData(0, 0, size.width, size.height);

			for(var i = 3, l = imageData.data.length; i < l; i += 4) {
				expect(imageData.data[i]).toEqual(0);
			}
		});

		it("should create a new layer that is CSS'd correctly", function() {
			var layer = layerManager.addNewLayer('new layer');

			expect(layer.style.position).toEqual('absolute');
			expect(layer.style.top).toEqual('0px');
			expect(layer.style.left).toEqual('0px');
		});
	});

	describe("changing active layer", function() {
		var size = null;
		var layerManager = null;
		beforeEach(function() {
			size = s(10,20);
			layerManager = new LTP.LayerManager(size);
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
	});

	describe("deleting layers", function() {
		var size = null;
		var layerManager = null;
		beforeEach(function() {
			size = s(10,20);
			layerManager = new LTP.LayerManager(size);
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

	describe("moving layers", function() {
		var size = null;
		var layerManager = null;
		beforeEach(function() {
			size = s(10,20);
			layerManager = new LTP.LayerManager(size);
		});

		it("should have the correct z-indices after adding layers", function() {
			var numLayers = 3;

			for(var i = 0; i < numLayers; ++i) {
				layerManager.addNewLayer();
			}
			
			for(var i = 0; i < layerManager.count; ++i) {
				var layer = layerManager.setActiveLayer(i);
				expect(layer.style.zIndex).toEqual(i.toString());
			}
		});

		it("should move the layer correctly", function() {
			for(var i = 0; i < 2; ++i) {
				layerManager.addNewLayer("otherLayer" + i);
			}

			var targetLayerName = "targetLayer";
			var targetLayer = layerManager.addNewLayer(targetLayerName);

			expect(targetLayer.style.zIndex).toEqual('3');

			layerManager.moveLayer(3, 2);
			
			var thirdLayer = layerManager.setActiveLayer(3);
			var secondLayer = layerManager.setActiveLayer(2);

			expect(thirdLayer.layerName).toEqual("otherLayer1");
			expect(secondLayer.layerName).toEqual(targetLayerName);
			expect(thirdLayer.style.zIndex).toEqual('3');
			expect(secondLayer.style.zIndex).toEqual('2');
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
			var size = s(3,1);
			var layerManager = new LTP.LayerManager(size);

			var context1 = layerManager.activeLayer.getContext('2d');
			var context2 = layerManager.addNewLayer("layer2").getContext('2d');

			drawPixel(context1, "red", 0, 0);
			drawPixel(context2, "blue", 1, 0);

			var composited = layerManager.composite().getContext('2d');

			var imageData = composited.getImageData(0,0,size.width, size.height);
			// expect first pixel to be red, fully opaque
			expect(imageData.data[0]).toEqual(255);
			expect(imageData.data[1]).toEqual(0);
			expect(imageData.data[2]).toEqual(0);
			expect(imageData.data[3]).toEqual(255);

			// expect second pixel to be blue, fully opaque
			expect(imageData.data[4]).toEqual(0);
			expect(imageData.data[5]).toEqual(0);
			expect(imageData.data[6]).toEqual(255);
			expect(imageData.data[7]).toEqual(255);

			// expect third pixel to be fully transparent (don't care about rgb values)
			expect(imageData.data[11]).toEqual(0);
		});
	});

});

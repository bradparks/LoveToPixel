describe("LayerManager", function() {

	describe("construction", function() {
		it("should throw if no project provided", function() {
			var fn = function() {
				new LTP.Manager();
			};

			expect(fn).toThrow();
		});

		it("should set to the passed in size", function() {
			var size = s(40, 50);
			var project = {
				size: size
			};
			var layerManager = new LTP.LayerManager(project);

			expect(layerManager.size).toEqual(size);
		});

		it("should get constructed with an initial background layer", function() {
			var size = s(12, 34);
			var layerManager = new LTP.LayerManager({
				size: size
			});

			expect(layerManager.count).toEqual(1);

			var activeLayer = layerManager.activeLayer;
			expect(activeLayer).toBeDefined();
			expect(activeLayer).not.toBeNull();
			expect(activeLayer.width).toEqual(size.width);
			expect(activeLayer.height).toEqual(size.height);
			expect(activeLayer.layerName).toEqual(LTP.LayerManager.prototype.InitialLayerName);
			expect(activeLayer.isVisible).toEqual(true);
		});

		it("should create the base layer with the provided image", function() {
			runs(function() {
				var canvas = document.createElement('canvas');
				canvas.width = 2;
				canvas.height = 2;
				var context = canvas.getContext('2d');
				context.fillStyle = 'red';
				context.fillRect(0, 0, 2, 2);

				var size = s(2, 2);
				var layerManager = new LTP.LayerManager({
					size: size,
					layers: [{
						layerId: 1,
						layerName: 'foo',
						data: canvas.toDataURL(),
						index: 3
					}]
				});

				this.layer = layerManager.activeLayer;
			});

			waitsFor(function() {
				return this.layer.dataLoaded;
			});

			runs(function() {
				var imageData = this.layer.getContext('2d').getImageData(0, 0, 2, 2);
				for (var i = 0; i < imageData.data.length; i += 4) {
					expect(imageData.data[i]).toBe(255);
				}
			});
		});
	});

	describe("layer creation", function() {
		var size = null;
		var layerManager = null;

		beforeEach(function() {
			size = s(30, 40);
			layerManager = new LTP.LayerManager({
				size: size
			});
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
			size = s(2, 2);
			layerManager = new LTP.LayerManager({
				size: size
			});

			var layer = layerManager.addNewLayer('new layer');

			var imageData = layer.getContext('2d').getImageData(0, 0, size.width, size.height);

			for (var i = 3, l = imageData.data.length; i < l; i += 4) {
				expect(imageData.data[i]).toEqual(0);
			}
		});

		it("should create a new layer that is CSS'd correctly", function() {
			var layer = layerManager.addNewLayer('new layer');

			expect(layer.style.position).toEqual('absolute');
			expect(layer.style.top).toEqual('0px');
			expect(layer.style.left).toEqual('0px');
		});

		it("should increment the names when creating unnamed layers repeatedly", function() {
			var layerManager = new LTP.LayerManager({ size: size });
			var layer1 = layerManager.addNewLayer();
			var layer2 = layerManager.addNewLayer();

			var layer1Suffix = layer1.layerName.substring(layer1.layerName.length - 1);
			var layer2Suffix = layer2.layerName.substring(layer2.layerName.length - 1);

			expect(layer1Suffix).toEqual('1');
			expect(layer2Suffix).toEqual('2');

			var layer3 = layerManager.addNewLayer('new layer 3');

			var layer4 = layerManager.addNewLayer();

			var layer4Suffix = layer4.layerName.substring(layer4.layerName.length - 1);
			// the incrementer should be blind to existing layers, not try to be too smart
			expect(layer4Suffix).toEqual('3');

			layerManager.deleteLayer(1);

			var layer5 = layerManager.addNewLayer();

			var layer5Suffix = layer5.layerName.substring(layer5.layerName.length - 1);
			// deleting existing layers should not affect the indexer
			expect(layer5Suffix).toEqual('4');

		});
	});

	describe("changing active layer", function() {
		var size = null;
		var layerManager = null;
		beforeEach(function() {
			size = s(10, 20);
			layerManager = new LTP.LayerManager({
				size: size
			});
		});

		it("should change the active layer", function() {
			var newLayerName = "newLayer";

			layerManager.addNewLayer(newLayerName);

			var activeLayer = layerManager.activeLayer;
			expect(activeLayer.layerName).toEqual(newLayerName);

			layerManager.setActiveLayer(0);
			activeLayer = layerManager.activeLayer;
			expect(activeLayer.layerName).not.toEqual(newLayerName);
			expect(activeLayer.layerName).toEqual(layerManager.InitialLayerName);
		});
	});

	describe("deleting layers", function() {
		var size = null;
		var layerManager = null;
		beforeEach(function() {
			size = s(10, 20);
			layerManager = new LTP.LayerManager({
				size: size
			});
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
			size = s(10, 20);
			layerManager = new LTP.LayerManager({
				size: size
			});
		});

		it("should have the correct z-indices after adding layers", function() {
			var numLayers = 3;

			for (var i = 0; i < numLayers; ++i) {
				layerManager.addNewLayer();
			}

			for (var i = 0; i < layerManager.count; ++i) {
				var layer = layerManager.setActiveLayer(i);
				expect(layer.style.zIndex).toEqual(((i + 1) * 3).toString());
			}
		});

		it("should move the layer after correctly", function() {
			var layers = [];
			for (var i = 0; i < 5; ++i) {
				layers.push(layerManager.addNewLayer("otherLayer" + i));
			}

			// layers = [ol0, ol1, ol2, ol3, ol4]
			layerManager.moveLayerAhead(layers[0], layers[3]);

			layers = [layers[1], layers[2], layers[3], layers[0], layers[4]];

			for (var i = 0; i < layers.length; ++i) {
				// +1 because layerManager's layers array also contains the background
				expect(layerManager.layers[i + 1]).toEqual(layers[i]);
				expect(layerManager.layers[i].style.zIndex).toEqual(((i + 1) * 3).toString());
			}
		});

		it("should move the layer behind correctly", function() {
			var layers = [];
			for (var i = 0; i < 5; ++i) {
				layers.push(layerManager.addNewLayer("otherLayer" + i));
			}

			// layers = [ol0, ol1, ol2, ol3, ol4]
			layerManager.moveLayerBehind(layers[0], layers[3]);

			layers = [layers[1], layers[2], layers[0], layers[3], layers[4]];

			for (var i = 0; i < layers.length; ++i) {
				// +1 because layerManager's layers array also contains the background
				expect(layerManager.layers[i + 1]).toEqual(layers[i]);
				expect(layerManager.layers[i].style.zIndex).toEqual(((i + 1) * 3).toString());
			}
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
			var size = s(3, 1);
			var layerManager = new LTP.LayerManager({
				size: size
			});

			var context1 = layerManager.activeLayer.getContext('2d');
			var context2 = layerManager.addNewLayer("layer2").getContext('2d');

			drawPixel(context1, "red", 0, 0);
			drawPixel(context2, "blue", 1, 0);

			var composited = layerManager.composite().getContext('2d');

			var imageData = composited.getImageData(0, 0, size.width, size.height);
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

	describe("flattening", function() {
		var size = null;
		var layerManager = null;

		beforeEach(function() {
			size = s(30, 40);
			layerManager = new LTP.LayerManager({
				size: size
			});
		});
	
		it("should do nothing if there are no layers", function() {
			layerManager.deleteLayer(0);

			expect(layerManager.count).toBe(0);

			var flattened = layerManager.flatten();
			expect(flattened).toBeUndefined();

			expect(layerManager.count).toBe(0);
		});

		it("should end up with only one layer after a flatten", function() {
			var layerCount = 3;

			for(var i = 0; i < layerCount; ++i) {
				layerManager.addNewLayer();
			}

			// layer manager always creates an initial layer, so adding 1
			expect(layerManager.count).toEqual(layerCount + 1);

			var flattenedLayer = layerManager.flatten();

			expect(flattenedLayer).not.toBeUndefined();
			expect(layerManager.count).toBe(1);
		});
	});

});


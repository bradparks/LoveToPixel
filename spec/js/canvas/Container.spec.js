describe("Container", function() {
	var size = s(10, 20);
	var messages = ['zoomChanged', 'newLayerCreated', 'activeLayerChanged', 'layerRemoved', 'noLayersInProject'];

	describe("construction", function() {
		it("should throw if not given a size", function() {
			var fn = function() {
				new LTP.Container(null, document.createElement('div'));
			}

			expect(fn).toThrow();
		});

		it("should throw if not given a containing element", function() {
			var fn = function() {
				new LTP.Container(size);
			};

			expect(fn).toThrow();
		});
	});
	describe("operations", function() {
		var containingElement;
		var container;
		var mb;

		beforeEach(function() {
			outerElement = document.createElement('div');
			containingElement = document.createElement('div');
			outerElement.appendChild(containingElement);

			mb = new LTP.MessageBus(messages);

			container = new LTP.Container(size, containingElement, mb);
		});

		describe("zooming", function() {
			it("should set zoom on the containing element", function() {
				container.zoomTo(2);
				expect(containingElement.style.zoom).toEqual('200%');
	
				container.zoomTo(.5);
				expect(containingElement.style.zoom).toEqual('50%');
			});

			it("should respond to the zoomChanged message", function() {
				var newZoom = 3;
				spyOn(container, 'zoomTo');

				mb.publish('zoomChanged', newZoom);

				expect(container.zoomTo).toHaveBeenCalledWith(newZoom);
			});
		});
	
		describe("adding a layer", function() {
			it("should make the containing element the layer's parent", function() {
				var layer = document.createElement('canvas');

				container.addLayer(layer);

				expect(layer.parentNode).toEqual(containingElement);
				expect(layer.style.position).toBe('absolute');
				expect(layer.style.top).toBe('0px');
				expect(layer.style.left).toBe('0px');
			});

			it("should center the layer in the container", function() {
				containingElement.style.width = '600px';
				containingElement.style.height = '600px';

				var body = document.getElementsByTagName('body')[0];
				body.appendChild(containingElement);

				var layer = document.createElement('canvas');
				layer.width = 400;
				layer.height = 400;

				container.addLayer(layer);

				expect(layer.style.left).toBe('100px');
				expect(layer.style.top).toBe('100px');
			});
		});

		describe("adding the overlay", function() {
			it("should set the overlay's zindex very high", function() {
				var overlay = document.createElement('canvas');

				container.overlay = overlay;

				expect(overlay.style.zIndex > 1000).toBe(true);
				expect(overlay.style.position).toBe('absolute');
				expect(overlay.style.top).toBe('0px');
				expect(overlay.style.left).toBe('0px');
			});
		});

		describe("grid", function() {
			it("should add the grid with a high zindex but below the overlay", function() {
				var grid = document.createElement('canvas');
				var overlay = document.createElement('canvas');

				container.grid = grid;
				container.overlay = overlay;

				expect(grid.style.zIndex > 1000).toBe(true);
				expect(overlay.style.zIndex > grid.style.zIndex).toBe(true);
			});
		});
	});
});


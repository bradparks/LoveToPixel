describe("Container", function() {
	describe("construction", function() {
		it("should throw if not given a containing element", function() {
			var fn = function() {
				new LTP.Container();
			};

			expect(fn).toThrow();
		});
	});
	describe("operations", function() {
		var containingElement;
		var container;

		beforeEach(function() {
			containingElement = document.createElement('div');
			container = new LTP.Container(containingElement);
		});

		describe("zooming", function() {
			it("should set zoom on the containing element", function() {
				container.zoomTo(2);
				expect(containingElement.style.zoom).toEqual('200%');
	
				container.zoomTo(.5);
				expect(containingElement.style.zoom).toEqual('50%');
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
	});

});

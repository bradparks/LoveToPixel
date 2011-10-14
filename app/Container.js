(function() {
	LTP.Container = function Container(containingElement) {	
		if(!containingElement) {
			throw new Error("Container: containingElement is required");
		}

		this._containingElement = containingElement;
	};

	LTP.Container.prototype = {
		zoomTo: function c_zoomTo(zoom) {
			this._containingElement.style.zoom = (zoom * 100).toString() + '%';
		},

		addLayer: function c_addLayer(layer) {
			layer.style.position = 'absolute';
			layer.style.top = 0;
			layer.style.left = 0;

			this._containingElement.appendChild(layer);
		},

		set overlay(overlay) {
			this.addLayer(overlay);
			overlay.style.zIndex = 2000;
		}
	};

})();

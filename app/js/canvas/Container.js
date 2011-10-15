(function() {
	var overlayIndex = 2000;
	var gridIndex = 1999;

	LTP.Container = function Container(containingElement) {	
		if(!containingElement) {
			throw new Error("Container: containingElement is required");
		}

		this._containingElement = containingElement;
		this._containingElement.style.cursor = 'none';
		this._layers = [];
	};

	LTP.Container.prototype = {
		zoomTo: function c_zoomTo(zoom) {
			this._containingElement.style.zoom = (zoom * 100).toString() + '%';
			//for(var i = 0; i < this._layers.length; ++i) {
				//this._layers[i].getContext('2d').scale(zoom, zoom);
			//}
		},

		addLayer: function c_addLayer(layer) {
			layer.style.position = 'absolute';
			layer.style.top = 0;
			layer.style.left = 0;
			layer.style.cursor = 'none';

			this._containingElement.appendChild(layer);
			this._layers.push(layer);
		},

		set overlay(overlay) {
			this.addLayer(overlay);
			overlay.style.zIndex = overlayIndex;
		},

		set grid(grid) {
			this.addLayer(grid);
			grid.style.zIndex = gridIndex;
		},

		setScratchForLayer: function c_setScratchForLayer(scratch, layer) {		
			var layerFound = false;
			for(var i = 0; i < this._layers.length; ++i) {
				if(this._layers[i] === layer) {
					layerFound = true;
					break;
				}
			}

			if(layerFound) {
				var layerZindex = parseInt(layer.style.zIndex, 10);
				this.addLayer(scratch);
				scratch.style.zIndex = layerZindex + 1;
			}
		}
	};

})();

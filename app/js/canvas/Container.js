(function() {
	var overlayIndex = 2000;
	var gridIndex = 1999;

	LTP.Container = function Container(containingElement, messageBus) {	
		if(!containingElement) {
			throw new Error("Container: containingElement is required");
		}

		this._containingElement = containingElement;
		this._layers = [];

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._messageBus.subscribe('zoomChanged', this._onZoomChanged, this);
	};

	LTP.Container.prototype = {
		zoomTo: function c_zoomTo(zoom) {
			this._containingElement.style.zoom = (Math.round(zoom * 100)).toString() + '%';

			for(var i = 0; i < this._layers.length; ++i) {
				this._centerLayer(this._layers[i]);
			}
		},

		addLayer: function c_addLayer(layer) {
			layer.style.position = 'absolute';
			this._centerLayer(layer);

			this._containingElement.appendChild(layer);
			this._layers.push(layer);
		},

		_centerLayer: function c_centerLayer(layer) {
			var top = (this._containingElement.offsetHeight / 2 - layer.height / 2);
			var left = (this._containingElement.offsetWidth / 2 - layer.width / 2);

			layer.style.top = Math.max(0, top) + "px";
			layer.style.left = Math.max(0, left) + "px";
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
		},

		destroy: function() {
			this._layers = null;
			this._messageBus.unsubscribe('zoomChanged', this._onZoomChanged);
			this._messageBus = null;
		},

		_onZoomChanged: function c_onZoomChanged(newZoom) {
			this.zoomTo(newZoom);
		}
	};

})();

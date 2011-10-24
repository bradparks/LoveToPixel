(function() {
	var overlayIndex = 2000;
	var gridIndex = 1999;

	LTP.Container = function Container(imageSize, containingElement, messageBus) {	
		if(!imageSize) {
			throw new Error("Container: size is required");
		}

		if(!containingElement) {
			throw new Error("Container: containingElement is required");
		}

		this._imageSize = imageSize;

		this._containingElement = containingElement;
		this._layers = [];

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._messageBus.subscribe('zoomChanged', this._onZoomChanged, this);
		this._messageBus.subscribe('newLayerCreated', this.addLayer, this);
		this._messageBus.subscribe('activeLayerChanged', this._setScratchForLayer, this);

		this._mouseMoveListener = LTP.util.bind(this._onMouseMove, this);
		this._containingElement.parentNode.addEventListener('mousemove', this._mouseMoveListener, false);

		this._pointTransformer = new LTP.PointTransformer();

		window.addEventListener("resize", LTP.util.bind(this._centerLayers, this), false);
	};

	LTP.Container.prototype = {
		zoomTo: function c_zoomTo(zoom) {
			this._pointTransformer.zoom = zoom;
			this._containingElement.style.zoom = (Math.round(zoom * 100)).toString() + '%';

			this._centerLayers();

			if(this._mouseCoords) {
				this._scrollTo(this._mouseCoords);
			}
		},

		_centerLayers: function() {
			for(var i = 0; i < this._layers.length; ++i) {
				this._centerLayer(this._layers[i]);
			}
		},

		_scrollTo: function c_scrollTo(point) {
			var percentX = point.x / this._imageSize.x;
			var percentY = point.y / this._imageSize.y;

			var n = this._containingElement.parentNode;
			n.scrollLeft = n.scrollWidth * percentX - n.clientWidth / 2;
			n.scrollTop = n.scrollHeight * percentY - n.clientHeight / 2;
		},

		addLayer: function c_addLayer(layer) {
			layer.style.position = 'absolute';
			layer.style.cursor = 'none';
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

		set scratch(scratch) {
			this._scratch = scratch;
			this.addLayer(scratch);
		},

		_setScratchForLayer: function c_setScratchForLayer(layer) {		
			var layerFound = false;
			for(var i = 0; i < this._layers.length; ++i) {
				if(this._layers[i] === layer) {
					layerFound = true;
					break;
				}
			}

			if(layerFound) {
				var layerZindex = parseInt(layer.style.zIndex, 10);
				this._scratch.style.zIndex = layerZindex + 1;
			}
		},

		destroy: function() {
			this._layers = null;
			this._messageBus.unsubscribe('zoomChanged', this._onZoomChanged);
			this._messageBus = null;

			this._containingElement.parentNode.removeEventListener('mousemove', this._mouseMoveListener, false);
		},

		_onZoomChanged: function c_onZoomChanged(newZoom) {
			this.zoomTo(newZoom);
		},

		_onMouseMove: function c_onMouseMove(e) {
			this._mouseCoords = this._pointTransformer.transform(p(e.offsetX, e.offsetY));
		}
	};

})();

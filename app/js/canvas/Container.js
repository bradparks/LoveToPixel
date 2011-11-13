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

		this._zoom = 1;
		this._imageSize = imageSize;

		this._containingElement = containingElement;
		this._layers = [];

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._messageBus.subscribe('zoomChanged', this._onZoomChanged, this);
		this._messageBus.subscribe('newLayerCreated', this._onNewLayerCreated, this);
		this._messageBus.subscribe('activeLayerChanged', this._onActiveLayerChanged, this);

		this._mouseMoveListener = LTP.util.bind(this._onMouseMove, this);
		this._containingElement.parentNode.addEventListener('mousemove', this._mouseMoveListener, false);

		this._pointTransformer = new LTP.PointTransformer();

		this._windowResizeListener = LTP.util.bind(this._onWindowResize, this);
		window.addEventListener("resize", this._windowResizeListener, false);

		this._addTransparencyBackdrop();
	};

	LTP.Container.prototype = {
		zoomTo: function(zoom) {
			this._zoom = zoom;
			this._pointTransformer.zoom = zoom;
			this._containingElement.style.zoom = (Math.round(zoom * 100)).toString() + '%';
			Ext.Array.each(this._layers, function(layer) {
				layer.style.MozTransform = 'scale(' + zoom + ')';
			});
			this._backdrop.style.MozTransform = 'scale(' + zoom + ')';
			//this._containingElement.style.MozTransform = 'scale(' + zoom + ')';


			this._centerLayers();

			if(this._mouseCoords) {
				this._scrollTo(this._mouseCoords);
			}
		},

		_centerLayers: function() {
			var method = LTP.util.platformInfo.isFirefox ? this._centerLayerFirefox : this._centerLayer;

			method.call(this, this._backdrop);
			for(var i = 0; i < this._layers.length; ++i) {
				method.call(this, this._layers[i]);
			}
		},

		_centerLayerFirefox: function(layer) {
			console.log(this._containingElement.clientWidth);
			console.log(layer.clientWidth);

			var outsideWidth = (this._imageSize.width * this._zoom - this._containingElement.clientWidth) / 2;
			var outsideHeight = (this._imageSize.height * this._zoom - this._containingElement.clientHeight) / 2;

			var nonScaledLeft = (this._containingElement.clientWidth - this._imageSize.width) / 2;
			var nonScaledTop = (this._containingElement.clientHeight - this._imageSize.height) / 2;

			if(outsideWidth > 0) {
				nonScaledLeft += outsideWidth;
			}

			if(outsideHeight > 0) {
				nonScaledTop += outsideHeight;
			}

			layer.style.top = Math.round(nonScaledTop) + 'px';
			layer.style.left = Math.round(nonScaledLeft) + 'px';

			// figure out how much the scaled layer is sticking out of the container
			// if it has left the container:
				// move the NON scaled container's top/left in by that amount
			// else
				// just place top/left at the nonscaled location
		},

		_centerLayer: function(layer) {
			var top = (this._containingElement.offsetHeight / 2 - layer.height / 2);
			var left = (this._containingElement.offsetWidth / 2 - layer.width / 2);

			layer.style.top =  Math.max(0, Math.round(top)) + "px";
			layer.style.left = Math.max(0, Math.round(left)) + "px";
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

			this._containingElement.appendChild(layer);
			this._centerLayer(layer);
			this._layers.push(layer);
		},

		_addTransparencyBackdrop: function c_addTransparencyBackdrop() {
			var backdrop = document.createElement('div');
			backdrop.id = 'transparencyBackdropElement';
			backdrop.style.position = 'absolute'
			backdrop.style.cursor = 'none';
			backdrop.style.width = this._imageSize.width + "px";
			backdrop.style.height = this._imageSize.height + "px";
			backdrop.width = this._imageSize.width;
			backdrop.height = this._imageSize.height;

			this._containingElement.appendChild(backdrop);
			this._centerLayer(backdrop);

			this._backdrop = backdrop;
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

		_onNewLayerCreated: function c_onNewLayerCreated(layer) {
			this.addLayer(layer);
		},

		_onActiveLayerChanged: function c_onActiveLayerChanged(layer) {
			this._setScratchForLayer(layer);
		},

		_onMouseMove: function c_onMouseMove(e) {
			this._mouseCoords = this._pointTransformer.transform(p(e.offsetX, e.offsetY));
		},

		_onWindowResize: function c_onWindowResize() {
			this._centerLayers();
		}
	};

})();

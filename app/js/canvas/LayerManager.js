(function() {
	function canvasToLayer(canvas) {
		canvas.__defineGetter__("layerName", function() {
			return this.dataset.layerName;
		});
	
		canvas.__defineSetter__("layerName", function(layerName) {
			this.dataset.layerName = layerName;
		});

		canvas.__defineGetter__("isVisible", function() {
			return this.style.display === '';
		});

		canvas.__defineSetter__("isVisible", function(visible) {
			this.style.display = visible ? "" : "none";
		});

		canvas.__defineGetter__("index", function() {
			return parseInt(this.style.zIndex, 10);
		});
	}

	LTP.LayerManager = function LayerManager(sizeOrImage, messageBus) {
		this._size = s(sizeOrImage.width, sizeOrImage.height);

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._layers = [];

		var backgroundLayer = this.addNewLayer(this.BaseLayerName, sizeOrImage);

		this._updateZIndices();
	};

	LTP.LayerManager.prototype = {
		BaseLayerName: "initial layer",

		dumpLayers: function() {
			for(var i = 0; i < this._layers.length; ++i) {
				var layer = this._layers[i];

				window.open(layer.toDataURL('png'), layer.layerName + i);
			}
		},

		get count() {
			return this._layers.length;
		},

		get layers() {
			return this._layers;
		},

		get activeLayer() {
			return this._layers[this._activeLayerIndex];
		},

		setActiveLayer: function lm_setActiveLayer(index) {
			if(index < 0 || index >= this.count) {
				throw new Error("LayerManager.setActiveLayer: index out of range");
			}

			this._activeLayerIndex = index;

			this._messageBus.publish("activeLayerChanged", this.activeLayer);

			return this.activeLayer;
		},

		setActiveLayerByLayer: function lm_setActiveLayerByLayer(layer) {
			var index = this._layers.indexOf(layer);

			if(index > -1) {
				this.setActiveLayer(index);
			}
		},

		addNewLayer: function lm_addNewLayer(name, sizeOrImage) {
			this._layers.push(this._createLayer(name || "new layer " + this._layers.length, sizeOrImage ));
			this._activeLayerIndex = this._layers.length - 1;
			this._updateZIndices();

			this._messageBus.publish("newLayerCreated", this.activeLayer);

			this.setActiveLayer(this._activeLayerIndex);

			return this.activeLayer;
		},

		moveLayerAhead: function(movedLayer, targetLayer) {
			var movedIndex = this._layers.indexOf(movedLayer);
			this._layers.splice(movedIndex, 1);

			var targetIndex = this._layers.indexOf(targetLayer);
			this._layers.splice(targetIndex + 1, 0, movedLayer);

			this._updateZIndices();
		},

		moveLayerBehind: function(movedLayer, targetLayer) {
			var movedIndex = this._layers.indexOf(movedLayer);
			this._layers.splice(movedIndex, 1);

			var targetIndex = this._layers.indexOf(targetLayer);
			this._layers.splice(targetIndex, 0, movedLayer);

			this._updateZIndices();
		},

		deleteLayer: function lm_deleteLayer(index) {
			if(this.count === 1) {
				throw new Error("LayerManager.deleteLayer can not delete the last layer");
			}

			if(index < 0 || index >= this.count) {
				throw new Error("LayerManger.deleteLayer: index out of range: " + index);
			}

			var deletedLayer = this._layers.splice(index, 1);

			if(this._activeLayerIndex >= this.count) {
				this._activeLayerIndex = this.count - 1;
			}

			this.activeLayer.isVisible = true;
			this._updateZIndices();

			return { deleted: deletedLayer, active: this.activeLayer };
		},

		composite: function lm_composite() {
			var compositeCanvas = this._createLayer('composite');
			var compositeContext = compositeCanvas.getContext('2d');

			for(var i = 0, l = this.count; i < l; ++i) {
				var layer = this._layers[i];
				if(layer.isVisible) {
					compositeContext.drawImage(layer, 0, 0);
				}
			}

			return compositeCanvas;
		},

		destroy: function() {
			this._layers = null;
		},

		_createLayer: function(name, sizeOrImage) {
			var canvas = document.createElement('canvas');
			canvasToLayer(canvas);
			canvas.layerName = name;
			canvas.layerManager = this;

			canvas.width = this._size.width;
			canvas.height = this._size.height;
			canvas.style.position = "absolute";
			canvas.style.top = 0;
			canvas.style.left = 0;

			if(sizeOrImage && sizeOrImage.src) {
				var context = canvas.getContext('2d');
				context.save();
				context.drawImage(sizeOrImage, 0, 0);
				context.restore();
			}

			return canvas;
		},
		
		_updateZIndices: function() {
			for(var i = 0; i < this._layers.length; ++i) {
				this._layers[i].style.zIndex = (i+1) * 3;
			}
		}
	};
})();

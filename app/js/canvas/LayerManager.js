(function() {
	LTP.LayerManager = function LayerManager(project, messageBus) {
		if (!project) {
			throw new Error("LayerManager: project is required");
		}

		this._size = project.size;

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		if (project.layers) {
			this._layers = this._hydrateLayersFromProject(project);
		} else {
			this._layers = [this._createLayer(this.InitialLayerName, project.size)]
		}

		this._activeLayerIndex = this._layers.length - 1;
	};

	LTP.LayerManager.prototype = {
		InitialLayerName: 'Initial Layer',

		_hydrateLayersFromProject: function lm_hydrateLayersFromProject(project) {
			var layers = [];
			for (var i = 0; i < project.layers.length; ++i) {
				var layerConfig = project.layers[i];
				var newLayer = this._createLayer(layerConfig.layerName, project.size, layerConfig.data);
				newLayer.index = layerConfig.index;
				newLayer.layerId = layerConfig.layerId;
				layers.push(newLayer);
			}

			layers.sort(function(layerA, layerB) {
				return layerA.index - layerB.index;
			});

			return layers;
		},

		dumpLayers: function() {
			for (var i = 0; i < this._layers.length; ++i) {
				var layer = this._layers[i];

				window.open(layer.toDataURL('png'), layer.layerName + i);
			}
		},

		setActiveLayer: function lm_setActiveLayer(index) {
			if (index < 0 || index >= this.count) {
				throw new Error("LayerManager.setActiveLayer: index out of range");
			}

			this._activeLayerIndex = index;

			this._messageBus.publish("activeLayerChanged", this.activeLayer);

			return this.activeLayer;
		},

		setActiveLayerByLayer: function lm_setActiveLayerByLayer(layer) {
			var index = this._layers.indexOf(layer);

			if (index > - 1) {
				this.setActiveLayer(index);
			}
		},

		addNewLayer: function lm_addNewLayer(name, size) {
			this._layers.push(this._createLayer(name || "new layer " + this._layers.length, size));
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
			if (this.count === 1) {
				throw new Error("LayerManager.deleteLayer can not delete the last layer");
			}

			if (index < 0 || index >= this.count) {
				throw new Error("LayerManger.deleteLayer: index out of range: " + index);
			}

			var deletedLayer = this._layers.splice(index, 1);

			if (this._activeLayerIndex >= this.count) {
				this._activeLayerIndex = this.count - 1;
			}

			this.activeLayer.isVisible = true;
			this._updateZIndices();

			return {
				deleted: deletedLayer,
				active: this.activeLayer
			};
		},

		composite: function(maxSize) {
			maxSize = maxSize || this._size;
			var actualSize = LTP.util.scaleSize(this._size, maxSize);

			var compositeCanvas = this._createLayer('composite');
			compositeCanvas.width = actualSize.width;
			compositeCanvas.height = actualSize.height;

			var compositeContext = compositeCanvas.getContext('2d');

			for (var i = 0, l = this.count; i < l; ++i) {
				var layer = this._layers[i];
				if (layer.isVisible) {
					compositeContext.drawImage(layer, 0, 0, layer.width, layer.height, 0, 0, compositeCanvas.width, compositeCanvas.height);
				}
			}

			return compositeCanvas;
		},

		destroy: function() {
			this._layers = null;
		},

		_createLayer: function(name, size, data) {
			var canvas = LTP.util.canvas(this._size, {
				position: 'absolute',
				top: 0,
				left: 0
			});

			canvasToLayer(canvas);
			canvas.layerName = name;
			canvas.layerManager = this;

			if (data) {
				canvas.data = data;
			}

			return canvas;
		},

		_drawImageInto: function(image, layer) {
			var context = layer.getContext('2d');
			context.save();
			context.drawImage(image, 0, 0);
			context.restore();
		},

		_updateZIndices: function() {
			for (var i = 0; i < this._layers.length; ++i) {
				this._layers[i].style.zIndex = (i + 1) * 3;
			}
		}
	};

	Object.defineProperty(LTP.LayerManager.prototype, "dataLoaded", {
		get: function() {
			if (!this._layers || this._layers.length === 0) {
				return true;
			}
			for (var i = 0; i < this._layers.length; ++i) {
				if (!this._layers[i].dataLoaded) {
					return false;
				}
			}
			return true;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.LayerManager.prototype, "size", {
		get: function() {
			return this._size;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.LayerManager.prototype, "count", {
		get: function() {
			return this._layers.length;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.LayerManager.prototype, "layers", {
		get: function() {
			return this._layers;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.LayerManager.prototype, "activeLayer", {
		get: function() {
			return this._layers[this._activeLayerIndex];
		},
		enumerable: true
	});

	/*** Canvas, additional properties ***/
	// TODO: just put these properties on HTMLCanvasElement?

	function canvasToLayer(canvas) {
		Object.defineProperty(canvas, "layerName", {
			get: function() {
				return this._layerName;
			},
			set: function(layerName) {
				this._layerName = layerName;
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "isVisible", {
			get: function() {
				return this.style.display === '';
			},
			set: function(visible) {
				this.style.display = visible ? '': 'none';
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "index", {
			get: function() {
				return parseInt(this.style.zIndex, 10);
			},
			set: function(index) {
				this.style.zIndex = index;
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "data", {
			get: function() {
				return this.toDataURL('png');
			},
			set: function(data) {
				var me = this;
				var img = document.createElement('img');
				img.onload = function() {
					me.getContext('2d').drawImage(img, 0, 0);
					me.dataLoaded = true;
				};
				img.src = data;
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "thumbnailData", {
			get: function() {
				var size = LTP.util.scaleSize(s(this.width, this.height), s(50, 50));
				var thumbCanvas = LTP.util.canvas(size);

				thumbCanvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height, 0, 0, size.width, size.height);

				return thumbCanvas.toDataURL();
			},
			set: function(data) {
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "thumbnailHeight", {
			get: function() {
				var size = LTP.util.scaleSize(s(this.width, this.height), s(50, 50));
				return size.height;
			},
			set: function(height) {
			},
			enumerable: true
		});

		Object.defineProperty(canvas, "thumbnailWidth", {
			get: function() {
				var size = LTP.util.scaleSize(s(this.width, this.height), s(50, 50));
				return size.width;
			},
			set: function(width) {
			},
			enumerable: true
		});
		
	}
})();


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

		canvas.__defineSetter__("index", function(index) {
			this.style.zIndex = index;
		});

		canvas.__defineGetter__("data", function() {
			return this.toDataURL("png");
		});

		canvas.__defineSetter__("data", function(data) {
			var me = this;
			var img = document.createElement('img');
			img.onload = function() {
				me.getContext('2d').drawImage(img, 0, 0);
			};
			img.src = data;
		});
	}

	LTP.LayerManager = function LayerManager(project, messageBus) {
		this._size = project.size;

		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._layers = this._hydrateLayersFromProject(project);
		this._activeLayerIndex = this._layers.length - 1;
	};

	LTP.LayerManager.prototype = {
		_hydrateLayersFromProject: function lm_hydrateLayersFromProject(project) {
			var layers = [];
			for(var i = 0; i < project.layers.length; ++i) {
				var layerConfig = project.layers[i];
				var newLayer = this._createLayer(layerConfig.layerName, project.size, layerConfig.data);
				newLayer.index = layerConfig.index;
				newLayer['ltp.projectmodel_id'] = layerConfig['ltp.projectmodel_id'];
				newLayer.id = layerConfig.id;
				layers.push(newLayer);
			}

			layers.sort(function(layerA, layerB) {
				return layerA.index - layerB.index;
			});

			return layers;
		},

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

		_createLayer: function(name, size) {
			var canvas = LTP.util.canvas(this._size, {
				position: 'absolute',
				top: 0,
				left: 0
			});

			canvasToLayer(canvas);
			canvas.layerName = name;
			canvas.layerManager = this;

			if(data) {
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
			for(var i = 0; i < this._layers.length; ++i) {
				this._layers[i].style.zIndex = (i+1) * 3;
			}
		}
	};
})();


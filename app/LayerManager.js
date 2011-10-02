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
	}

	LTP.LayerManager = function LayerManager(size) {
		if(!(size instanceof LTP.Size)) {
			throw new Error("LayerManager: must be constructed with a Size");
		}
		this._size = size;

		this._layers = [];

		this._layers.push(this._createLayer(this.BaseLayerName));
		this._activeLayerIndex = 0;
	};

	LTP.LayerManager.prototype = {
		BaseLayerName: "background",
		get size() {
			return this._size;
		},
		get count() {
			return this._layers.length;
		},
		get activeLayer() {
			return this._layers[this._activeLayerIndex];
		},

		setActiveLayer: function lm_setActiveLayer(index) {
			if(index < 0 || index >= this.count) {
				throw new Error("LayerManager.setActiveLayer: index out of range");
			}

			this._activeLayerIndex = index;
			return this.activeLayer;
		},

		addNewLayer: function lm_addNewLayer(name) {
			this._layers.push(this._createLayer(name || "unnamed layer"));
			this._activeLayerIndex = this._layers.length - 1;

			return this.activeLayer;
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

			return { deleted: deletedLayer, active: this.activeLayer };
		},

		composite: function lm_composite() {
			var compositeCanvas = this._createLayer('composite');
			var compositeContext = compositeCanvas.getContext('2d');

			for(var i = 0, l = this.count; i < l; ++i) {
				var layer = this._layers[i];
				compositeContext.drawImage(layer, 0, 0);
			}

			return compositeCanvas;
		},

		// "gentleman" privates
		_createLayer: function(name) {
			var canvas = document.createElement('canvas');
			canvasToLayer(canvas);
			canvas.layerName = name;

			canvas.width = this.size.width;
			canvas.height = this.size.height;

			var context = canvas.getContext('2d');
			context.save();
			context.fillColor = "rgba(0,0,0,0)";
			context.fillRect(0, 0, this.size.width, this.size.height);
			context.restore();

			return canvas;
		}
	};
})();

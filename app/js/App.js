(function() {
	var _zoomLevels = [.25, .5, 1, 2, 4, 8, 16, 32];
	var _savedZoomIndex = undefined;
	var _currentZoomIndex = 2;
	var _gridLevels = [5, 10, 15, 20, 20000];
	var _currentGridIndex = 4;
	var _overrideActive = false;

	var _colors = [
		colors.black,
		colors.red,
		colors.lightGray,
		colors.blue,
		colors.green,
		colors.yellow,
		colors.orange,
		colors.purple,
		colors.gray,
		colors.brown
	];

	function _destroyAll(components) {
		var component;
		if(components) {
			for(var i = 0, len = components.length; i < len; ++i) {
				component = components[i];
				if(typeof component.destroy === 'function') {
					component.destroy();
				}
			}
		}
	}

	var app = {
		callbacks: {
			z: function() {
				_currentZoomIndex = (_currentZoomIndex + 1) % _zoomLevels.length;
				LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
			},
			u: function() {
				LTP.app.painter.undo();
			},
			r: function() {
				LTP.app.painter.redo();
			},
			g: function() {
				_currentGridIndex  = (_currentGridIndex + 1) % _gridLevels.length;
				LTP.app.grid.cellSize = _gridLevels[_currentGridIndex];
			},
			i: function() {
				if(_overrideActive) {
					LTP.app.painter.popOverrideTool();
					_overrideActive = false;
				} else {
					LTP.app.painter.pushOverrideTool(new LTP.EyeDropperTool());
					_overrideActive = true;
				}
			},
			adown: function() {
				_savedZoomIndex = _currentZoomIndex;
				_currentZoomIndex = 2;
				LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
			},
			aup: function() {
				_currentZoomIndex = _savedZoomIndex;
				LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
			},
			s: function() {
				var composited = LTP.app.layerManager.composite();
				window.open(composited.toDataURL('png'), 'savedImage');
			},
			' down': function() {
				if(_overrideActive) {
					LTP.app.painter.popOverrideTool();
				}
				LTP.app.painter.pushOverrideTool(new LTP.PanningTool());
				_overrideActive = true;
			},
			' up': function() {
				LTP.app.painter.popOverrideTool();
				_overrideActive = false;
			}
		},

		init: function(config) {
			Ext.apply(this, config);

			this.statusBar = Ext.create('LTP.StatusBar', {
				renderTo: this.statusBarElementId
			});
		},

		load: function(project) {
			var size = project.imageSize;

			_destroyAll(this._components);
			this._components = [];

			this.layerManager = new LTP.LayerManager(size, colors.white);
			this._components.push(this.layerManager);

			this.container = new LTP.Container(document.getElementById(this.containerElementId));
			this._components.push(this.container);

			this.painter = new LTP.Painter(size, new LTP.PointTransformer(), null, new LTP.BrushTool(colors.black, 20), new LTP.BrushTool(colors.white, 50));
			this._components.push(this.painter);

			this.grid = new LTP.Grid(size, 'gray', 20000);
			this._components.push(this.grid);

			this.container.addLayer(this.layerManager.activeLayer);
			this.painter.activeCanvas = this.layerManager.activeLayer;
			this.container.overlay = this.painter.overlay;
			this.container.grid = this.grid.canvas;
			this.container.setScratchForLayer(this.painter.scratch, this.layerManager.activeLayer);

			LTP.GlobalMessageBus.subscribe('colorSampled', function(rgbColor, hexColor) {
				this.painter.leftTool = new LTP.BrushTool(hexColor, 20);
			}, this);

			for(var i = 0; i < _colors.length; ++i) {
				this.callbacks[(i+1).toString()] = (function(i, painter) {
					return function() {
						painter.leftTool = new LTP.BrushTool(_colors[i], 20);
					}
				})(i, this.painter);
			}	

			this.keyListener = new LTP.KeyListener(this);
			this._components.push(this.keyListener);

			//TODO: these publishings need to go away
			LTP.GlobalMessageBus.publish('leftToolChanged', this.painter.leftTool);
			LTP.GlobalMessageBus.publish('rightToolChanged', this.painter.rightTool);
		}
	};

	LTP.app = app;
})();

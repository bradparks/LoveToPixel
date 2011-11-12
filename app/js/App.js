(function() {
	var _zoomLevels = [.125, .25, .5, 1, 1.5, 2, 3, 4, 6, 8, 16, 32, 64];
	var _fullSizeZoomIndex = _zoomLevels.indexOf(1);
	var _savedZoomIndex = undefined;
	var _currentZoomIndex = _fullSizeZoomIndex;
	var _gridLevels = [5, 10, 15, 20, 20000];
	var _currentGridIndex = 4;
	var _overrideActive = false;

	var _lockDirections = [
	LTP.DirectionLockTransformer.directions.upDown, LTP.DirectionLockTransformer.directions.leftRight];
	var _currentLockIndex = 0;

	var _colors = [
	colors.white, colors.black, colors.red, colors.lightGray, colors.blue, colors.green, colors.yellow, colors.orange, colors.purple, colors.gray, colors.brown, '#FF9999', '#33AA11', '#333333', '#88AAFF', '#337722', ];

	var _sizes = [1, 2, 3, 4, 5, 8, 14];

	function _destroyAll(components) {
		var component;
		if (components) {
			for (var i = 0, len = components.length; i < len; ++i) {
				component = components[i];
				if (typeof component.destroy === 'function') {
					component.destroy();
				}
			}
		}
	}

	var app = {
		callbacks: {
			c: function() {
				if (!LTP.app.floatingColorPalette) {
					LTP.app.floatingColorPalette = Ext.create('LTP.FloatingColorPalette', {
						colors: _colors
					});
				}

				LTP.app.floatingColorPalette.togglePopup();
			},
			b: function() {
				if (!LTP.app.floatingSizePalette) {
					LTP.app.floatingSizePalette = Ext.create('LTP.FloatingSizePalette', {
						sizes: _sizes
					});
				}

				LTP.app.floatingSizePalette.togglePopup();
			},
			escdown: function() {
				// TODO: this should be incorporated into the palette
				if (LTP.app.floatingColorPalette && LTP.app.floatingColorPalette.isPopped) {
					LTP.app.floatingColorPalette.togglePopup();
				}
			},
			z: function(shift) {
				var delta = shift ? - 1: 1;
				_currentZoomIndex += delta;
				if (_currentZoomIndex >= _zoomLevels.length) {
					_currentZoomIndex = _zoomLevels.length - 1;
				}
				if (_currentZoomIndex < 0) {
					_currentZoomIndex = 0;
				}

				LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
			},
			u: function() {
				LTP.app.painter.undo();
			},
			r: function() {
				LTP.app.painter.redo();
			},
			g: function() {
				_currentGridIndex = (_currentGridIndex + 1) % _gridLevels.length;
				LTP.app.grid.cellSize = _gridLevels[_currentGridIndex];
			},
			i: function() {
				if (_overrideActive) {
					LTP.app.painter.popOverrideTool();
					_overrideActive = false;
				} else {
					LTP.app.painter.pushOverrideTool(new LTP.EyeDropperTool());
					_overrideActive = true;
				}
			},
			adown: function(shift) {
				if (!shift) {
					_savedZoomIndex = _currentZoomIndex;
				}

				_currentZoomIndex = _fullSizeZoomIndex;
				LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
			},
			aup: function(shift) {
				if (!shift) {
					_currentZoomIndex = _savedZoomIndex;
					LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
				}
			},
			s: function() {
				LTP.app.projectPersister.saveProject(LTP.app._currentProject, LTP.app.layerManager.layers);
				LTP.GlobalMessageBus.publish('flairMessage', 'Project Saved');
			},
			e: function() {
				var composited = LTP.app.layerManager.composite();
				window.open(composited.toDataURL('png'), 'savedImage');
			},
			d: function() {
				LTP.app.layerManager.dumpLayers();
			},
			spacedown: function() {
				if (_overrideActive) {
					LTP.app.painter.popOverrideTool();
				}
				LTP.app.painter.pushOverrideTool(new LTP.PanningTool());
				_overrideActive = true;
			},
			spaceup: function() {
				LTP.app.painter.popOverrideTool();
				_overrideActive = false;
			},
			k: function() {
				if (_overrideActive) {
					LTP.app.painter.popOverrideTool();
				} else {
					LTP.app.painter.pushOverrideTool(new LTP.FillTool());
				}
				_overrideActive = ! _overrideActive;
			},
			controldown: function() {
				var direction = _lockDirections[_currentLockIndex];
				_currentLockIndex = (_currentLockIndex + 1) % _lockDirections.length;

				LTP.app.painter.adhocTransformer = new LTP.DirectionLockTransformer(direction);
				LTP.GlobalMessageBus.publish('lockChanged', direction);
			},
			controlup: function() {
				LTP.app.painter.adhocTransformer = null;
				LTP.GlobalMessageBus.publish('lockChanged', null);
			},
			altdown: function() {
				LTP.app.painter.adhocTransformer = new LTP.BrushSizeLockTransformer(20);
				LTP.GlobalMessageBus.publish('lockChanged', 'brush');
			},
			altup: function() {
				LTP.app.painter.adhocTransformer = null;
				LTP.GlobalMessageBus.publish('lockChanged', null);
			},
			n: function() {
				window.location = window.location;
			}
		},

		init: function(config) {
			Ext.apply(this, config);


			this.showProjectChooser();
		},

		showProjectChooser: function() {
			this.projectPersister = new LTP.ProjectPersister();

			this.projectPersister.loadAllProjects(function(projects) {
				this.projectChooser = Ext.create('LTP.ProjectChooser', {
					renderTo: Ext.getBody(),
					projects: projects,
					listeners: {
						projectChosen: this._load,
						scope: this
					}
				});
			},
			this);
		},

		_load: function(project) {
			this._currentProject = project;

			this.statusBar = Ext.create('LTP.StatusBar', {
				renderTo: this.statusBarElementId
			});

			this.layerPanel = Ext.create('LTP.LayerPanel', {
				renderTo: this.layerPanelElementId
			});

			_destroyAll(this._components);
			this._components = [];

			this.layerManager = new LTP.LayerManager(project);

			this._components.push(this.layerManager);

			this.container = new LTP.Container(project.size, document.getElementById(this.containerElementId));
			this._components.push(this.container);

			this.painter = new LTP.Painter(project.size, new LTP.PointTransformer());
			this._components.push(this.painter);

			this.grid = new LTP.Grid(project.size, 'gray', 20000);
			this._components.push(this.grid);

			Ext.Array.each(this.layerManager.layers, function(layer) {
				this.container.addLayer(layer)
			},
			this);

			this.painter.activeCanvas = this.layerManager.activeLayer;
			this.container.overlay = this.painter.overlay;
			this.container.grid = this.grid.canvas;
			this.container.scratch = this.painter.scratch;

			LTP.GlobalMessageBus.subscribe('colorSampled', function(rgbColor, hexColor, mouseButton) {
				var prefix = mouseButton === 0 ? 'left': 'right';
				LTP.GlobalMessageBus.publish(prefix + 'ColorSelected', hexColor);
				this.painter.popOverrideTool();
			},
			this);

			LTP.GlobalMessageBus.subscribe('leftSizeSelected', function(size) {
				this.painter.leftTool = new LTP.BrushTool(size);
			},
			this);

			LTP.GlobalMessageBus.subscribe('rightSizeSelected', function(size) {
				this.painter.rightTool = new LTP.BrushTool(size);
			},
			this);

			for (var i = 0; i < _colors.length; ++i) {
				this.callbacks[(i + 1).toString()] = (function(i, painter) {
					return function() {
						LTP.GlobalMessageBus.publish('leftColorSelected', _colors[i]);
					}
				})(i, this.painter);
			}

			this.keyListener = new LTP.KeyListener(this);
			this._components.push(this.keyListener);

			//TODO: these publishings need to go away
			LTP.GlobalMessageBus.publish('activeLayerChanged', this.layerManager.activeLayer);
			LTP.GlobalMessageBus.publish('leftColorSelected', this.painter.leftColor);
			LTP.GlobalMessageBus.publish('rightColorSelected', this.painter.rightColor);

			this.layerPanel.load(this.layerManager);
		}
	};

	LTP.app = app;
})();


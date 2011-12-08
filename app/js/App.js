(function() {
	var _zoomLevels = [.125, .25, .5, 1, 1.5, 2, 3, 4, 6, 8, 16, 32];
	var _fullSizeZoomIndex = _zoomLevels.indexOf(1);
	var _savedZoomIndex = undefined;
	var _currentZoomIndex = _fullSizeZoomIndex;
	var _gridLevels = [0, 5, 10, 15, 20];
	var _currentGridIndex = _gridLevels.indexOf(0);
	var _fillTool = new LTP.FillTool();
	var _eyeDropperTool = new LTP.EyeDropperTool();
	var _panningTool = new LTP.PanningTool();
	var _brushTool = new LTP.BrushTool();

	var _lockDirections = [
	LTP.DirectionLockTransformer.directions.upDown, LTP.DirectionLockTransformer.directions.leftRight];
	var _currentLockIndex = 0;

	var _defaultPalette = [
	colors.white, colors.black, colors.red, colors.lightGray, colors.blue, colors.green, colors.yellow, colors.orange, colors.purple, colors.gray, colors.brown, '#FF9999', '#33AA11', '#333333', '#88AAFF', '#337722', ];

	var _sizes = [1, 2, 3, 4, 5, 8, 14, 20, 24, 30];

	var app = {
		callbacks: {
			h: {
				fn: function() {
					Ext.create('LTP.HelpWindow', { commands: LTP.app.callbacks }).show();
				},
				message: 'Display this help'
			},
			c: {
				fn: function() {
					if (!LTP.app.floatingColorPalette) {
						LTP.app.floatingColorPalette = Ext.create('LTP.FloatingColorPalette', {
							colorManager: LTP.app.colorManager
						});
					}

					LTP.app.floatingColorPalette.togglePopup();
				},
				message: 'Display the color palette. Press again (or ESC) to hide'
			},
			b: {
				fn: function() {
					if (!LTP.app.floatingSizePalette) {
						LTP.app.floatingSizePalette = Ext.create('LTP.FloatingSizePalette', {
							sizes: _sizes
						});
					}

					LTP.app.floatingSizePalette.togglePopup();
				},
				message: 'Display the brush palette. Press again (or ESC) to hide'
			},
			dummy: { // just here to get 1-9 into the help window
				fn: function() {},
				label: '1-9',
				message: 'Change the left color to the nth color in your color palette',
				shiftMessage: 'Change the right color to the nth color in your color palette'
			},
			escdown: {
				fn: function() {
					// TODO: this should be incorporated into the palette
					if (LTP.app.floatingColorPalette && LTP.app.floatingColorPalette.isPopped) {
						LTP.app.floatingColorPalette.togglePopup();
					}
					if (LTP.app.floatingSizePalette && LTP.app.floatingSizePalette.isPopped) {
						LTP.app.floatingSizePalette.togglePopup();
					}
				},
				noHelp: true
			},
			z: {
				fn: function(shift) {
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
				message: 'Zoom in',
				shiftMessage: 'Zoom out'
			},
			u: {
				fn: function(shift) {
					if(shift) {
						LTP.app.painter.redo();
					} else {
						LTP.app.painter.undo();
					}
				},
				message: 'Undo the last paint operation',
				shiftMessage: 'Redo the last undone operation'
			},
			g: {
				fn: function() {
					_currentGridIndex = (_currentGridIndex + 1) % _gridLevels.length;
					LTP.app.grid.cellSize = _gridLevels[_currentGridIndex];
				},
				message: 'Toggle the grid'
			},
			i: {
				fn: function() {
					LTP.app.painter.leftTool = _eyeDropperTool;
				},
				message: 'Use the eye dropper tool'
			},
			k: {
				fn: function() {
					LTP.app.painter.leftTool = _fillTool;
				},
				message: 'Use the fill tool'
			},
			d: {
				fn: function() {
					LTP.app.painter.leftTool = _brushTool;
				},
				message: 'Use the brush tool'
			},
			//spacedown: {
				//fn: function() {
					//_resolveOverrideTool(_panningTool);
				//},
				//label: 'space',
				//message: 'Hold to use the pan tool'
			//},
			//spaceup: {
				//fn: function() {
					//if(_curOverrideTool === _panningTool) {
						//LTP.app.painter.popOverrideTool();
						//_curOverrideTool = null;
					//}
				//},
				//noHelp: true
			//},
			adown: {
				fn: function(shift) {
					if (!shift) {
						_savedZoomIndex = _currentZoomIndex;
					}

					_currentZoomIndex = _fullSizeZoomIndex;
					LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
				},
				label: 'a',
				message: 'Hold to zoom to 100%, let go to return to your previous zoom',
				shiftMessage: 'Return to 100% zoom'
			},
			aup: {
				fn: function(shift) {
					if (!shift && !! _savedZoomIndex) {
						_currentZoomIndex = _savedZoomIndex;
						LTP.GlobalMessageBus.publish('zoomChanged', _zoomLevels[_currentZoomIndex]);
					}
				},
				noHelp: true
			},
			controldown: {
				fn: function() {
					var direction = _lockDirections[_currentLockIndex];
					_currentLockIndex = (_currentLockIndex + 1) % _lockDirections.length;

					LTP.app.painter.adhocTransformer = new LTP.DirectionLockTransformer(direction);
					LTP.GlobalMessageBus.publish('lockChanged', direction);
				},
				label: 'CTRL',
				message: 'Hold to turn on direction lock. Cycles between vertical and horizontal lock'
			},
			controlup: {
				fn: function() {
					LTP.app.painter.adhocTransformer = null;
					LTP.GlobalMessageBus.publish('lockChanged', null);
				},
				noHelp: true
			},
			altdown: {
				fn: function() {
					LTP.app.painter.adhocTransformer = new LTP.BrushSizeLockTransformer();
					LTP.GlobalMessageBus.publish('lockChanged', 'brush');
				},
				label: 'ALT',
				message: 'Hold to lock the brush to the current brush size'
			},
			altup: {
				fn: function() {
					LTP.app.painter.adhocTransformer = null;
					LTP.GlobalMessageBus.publish('lockChanged', null);
				},
				noHelp: true
			},
			s: {
				fn: function() {
					LTP.app.projectPersister.saveProject(LTP.app._currentProject, LTP.app.layerManager.layers, LTP.app.colorManager.getColorsAsString());
					LTP.GlobalMessageBus.publish('flairMessage', 'Project Saved');
					LTP.app._currentProject.isDirty = false;
				},
				message: 'Save the project (to local storage)'
			},
			e: {
				fn: function() {
					var composited = LTP.app.layerManager.composite();
					window.open(composited.toDataURL('png'), 'savedImage');
				},
				message: 'Export the project to an image (opens in a new window)'
			},
			'[': {
				fn: function() {
					LTP.app.layerManager.dumpLayers();
				},
				noHelp: true
			},
			n: {
				fn: function() {
					window.location.reload();
				},
				message: 'Return to the project chooser'
			},
			p: {
				fn: function() {
					Ext.create('LTP.Publisher', {
						layerManager: LTP.app.layerManager,
						projectName: LTP.app._currentProject.name
					}).show();
				},
				message: 'Publish your project to imgur'
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

		_createDomStructure: function() {
			Ext.getBody().createChild('<div id="layerPanelElement"></div>');
			Ext.getBody().createChild('<div id="outerContainerElement"><div id="containerElement"></div></div >');
			Ext.getBody().createChild('<div id="statusBarElement"></div>');
		},

		_load: function(project) {
			this._currentProject = project;
			document.title = project.name + " - ltp";

			this._createDomStructure();

			this.statusBar = Ext.create('LTP.StatusBar', {
				renderTo: 'statusBarElement'
			});

			this.layerPanel = Ext.create('LTP.LayerPanel', {
				renderTo: 'layerPanelElement'
			});

			this.colorManager = new LTP.ColorManager();
			this.colorManager.setColorsFromString(project.palette, _defaultPalette);

			this.layerManager = new LTP.LayerManager(project);

			this.container = new LTP.Container(project.size, document.getElementById('containerElement'));

			this.painter = new LTP.Painter(project.size, new LTP.PointTransformer());

			this.grid = new LTP.Grid(project.size, 'gray', 0);

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
			},
			this);

			for (var i = 1; i < 10; ++i) {
				this.callbacks[i.toString()] = (function(i) {
					return function(shift) {
						var prefix = shift ? 'Right': 'Left';
						LTP.app.colorManager['set' + prefix + 'ColorTo'](i - 1);
					}
				})(i);
			}

			this.keyListener = new LTP.KeyListener(this);

			//TODO: these publishings need to go away
			LTP.GlobalMessageBus.publish('activeLayerChanged', this.layerManager.activeLayer);
			LTP.GlobalMessageBus.publish('leftColorSelected', this.painter.leftColor);
			LTP.GlobalMessageBus.publish('rightColorSelected', this.painter.rightColor);

			this._addCloseWarningHook();

			this.layerPanel.load(this.layerManager);
		},

		_addCloseWarningHook: function() {
			LTP.GlobalMessageBus.subscribe('canvasContentChange', function() {
				this._currentProject.isDirty = true;
			},
			this);

			LTP.GlobalMessageBus.subscribe('paletteContentChange', function() {
				this._currentProject.isDirty = true;
			},
			this);

			var me = this;
			window.onbeforeunload = function() {
				if (me._currentProject.isDirty) {
					return "There are unsaved changes to this project";
				}
			};
		}
	};

	LTP.app = app;
})();


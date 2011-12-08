(function() {
	LTP.Painter = function(size, pointTransformer, messageBus, leftTool, rightTool, leftColor, rightColor, leftSize, rightSize) {
		if (!size) {
			throw new Error("LTP.Painter: size is required");
		}

		if (!pointTransformer) {
			throw new Error("LTP.Painter: pointTransformer is required");
		}

		this._size = size;
		this._pointTransformer = pointTransformer;
		this._messageBus = messageBus || LTP.GlobalMessageBus;

		this._messageBus.subscribe('zoomChanged', this._onZoomChanged, this);
		this._messageBus.subscribe('activeLayerChanged', this._onActiveLayerChanged, this);
		this._messageBus.subscribe('leftColorSelected', this._onLeftColorSelected, this);
		this._messageBus.subscribe('rightColorSelected', this._onRightColorSelected, this);
		this._messageBus.subscribe('leftSizeSelected', this._onLeftSizeSelected, this);
		this._messageBus.subscribe('rightSizeSelected', this._onRightSizeSelected, this);
		this._messageBus.subscribe('cursorDisplayChangeRequest', this._onCursorDisplayChangeRequest, this);

		this._leftToolState = {
			down: false,
			color: leftColor || colors.black,
			size: leftSize || 8
		};
		this._rightToolState = {
			down: false,
			color: rightColor || colors.white,
			size: rightSize || 8
		};

		this.leftTool = leftTool || new LTP.BrushTool();
		this.rightTool = rightTool || new LTP.BrushTool();

		this._lastToolState = this._leftToolState;

		this._overlay = LTP.util.canvas(this._size, {
			position: 'absolute',
			cursor: 'none',
			top: 0,
			left: 0
		});

		this._scratch = LTP.util.canvas(this._size, {
			cursor: 'none',
			position: 'absolute',
			top: 0,
			left: 0
		});

		this._clear(this._overlay);
		this._clear(this._scratch);

		this._hook(this._overlay);

		this._undoRedoStates = [];
		this._currentUndoRedoStateIndex = - 1;
		this._entireBoundingBox = r(0, 0, this._size.width, this._size.height);
		this._zoom = 1;
	};

	LTP.Painter.prototype = {
		_hook: function p_hook(canvas) {
			this._setEventListeners(Ext.get(canvas), 'on');
		},

		_unhook: function p_unhook(canvas) {
			this._setEventListeners(Ext.get(canvas), 'un');
		},

		_setEventListeners: function p_setEventListeners(canvas, method) {
			canvas[method]('mousedown', this._onMouseDown, this);
			canvas[method]('mousemove', this._onMouseMove, this);
			canvas[method]('mouseout', this._onMouseOut, this);
			canvas[method]('mouseup', this._onMouseUp, this);
			canvas[method]('contextmenu', this._onContextMenu, this);
		},

		_setCursor: function(cursorString) {
			this._overlay.style.cursor = cursorString;
		},

		_getToolStateForButton: function(button) {
			return button === 0 ? this._leftToolState : this._rightToolState;
		},

		_doOverlay: function(point, toolState) {
			var point = point || this._lastOverlayPoint;
			toolState = toolState || this._lastToolState;

			if (point) {
				this._clear(this._overlay);
				var context = this._overlay.getContext('2d');
				this._lastToolState.tool.overlay(context, point, this._lastToolState.size);

				if (this._adhocTransformer && this._adhocTransformer.overlay) {
					this._adhocTransformer.overlay(context, point, this,_lastToolState.size);
				}

				this._lastOverlayPoint = point;
			}

			this._messageBus.publish('canvasMouseCoordinatesChanged', point);
		},

		_getLeftFirefox: function(fly) {
			var left = fly.getLeft();

			var widthDelta = this._size.width * this._zoom - this._size.width;
			widthDelta = widthDelta / 2;
			return left - widthDelta;
		},

		_getTopFirefox: function(fly) {
			var top = fly.getTop();

			var heightDelta = this._size.height * this._zoom - this._size.height;
			heightDelta = heightDelta / 2;
			return top - heightDelta;
		},

		_getCurrentPoint: function(e) {
			var t = Ext.fly(e.target);

			var left, top;
			if (LTP.util.platformInfo.isFirefox) {
				left = this._getLeftFirefox(t);
				top = this._getTopFirefox(t);
			} else {
				left = t.getLeft() * this._zoom;
				top = t.getTop() * this._zoom;
			}

			var x = e.getX() - left;
			var y = e.getY() - top;

			return p(x, y);
		},

		_onMouseDown: function p_onMouseDown(e) {
			e.preventDefault();
			this._clear(this._overlay);

			var toolState = this._getToolStateForButton(e.button);
			var currentPointNonTransformed = this._getCurrentPoint(e);
			var currentPoint = this._pointTransformer.transform(currentPointNonTransformed);

			if (this._adhocTransformer) {
				currentPoint = this._adhocTransformer.transform(currentPoint, currentPoint, toolState.size);
			}

			if (toolState.tool.causesChange) {
				this._pruneUndoRedoStates();
			}

			toolState.down = true;

			var canvas = toolState.tool.causesChange ? this._scratch: this._activeCanvas;

			toolState.tool.perform({
				canvas: canvas,
				imageCanvas: this._activeCanvas,
				context: canvas.getContext('2d'),
				lastPoint: currentPoint,
				currentPoint: currentPoint,
				lastPointNonTransformed: currentPointNonTransformed,
				currentPointNonTransformed: currentPointNonTransformed,
				containerElement: this._activeCanvas.parentNode.parentNode,
				mouseButton: e.button,
				color: toolState.color,
				size: toolState.size
			});

			toolState.lastPoint = currentPoint;
			toolState.lastPointNonTransformed = currentPointNonTransformed;

			if (toolState.tool.causesChange) {
				this._currentBoundingBox = new LTP.BoundingBoxBuilder(toolState.tool.getBoundsAt(currentPoint, toolState.size));
			}

			this._lastToolState = toolState;

			this._doOverlay(currentPoint);
		},

		_onMouseMove: function p_onMouseMove(e) {
			e.preventDefault();

			var toolState = this._getToolStateForButton(e.button);
			var currentPointNonTransformed = this._getCurrentPoint(e);
			var currentPoint = this._pointTransformer.transform(currentPointNonTransformed);
			var lastPoint = toolState.lastPoint || currentPoint;
			var lastPointNonTransformed = toolState.lastPointNonTransformed || currentPointNonTransformed;

			if (toolState.down) {
				if (this._adhocTransformer) {
					currentPoint = this._adhocTransformer.transform(lastPoint, currentPoint, toolState.tool.size);
					if (this._adhocTransformer.currentPointOnly) {
						lastPoint = currentPoint;
						lastPointNonTransformed = currentPointNonTransformed;
					}
				}

				var canvas = toolState.tool.causesChange ? this._scratch : this._activeCanvas;

				toolState.tool.perform({
					canvas: canvas,
					imageCanvas: this._activeCanvas,
					context: canvas.getContext('2d'),
					lastPoint: lastPoint,
					currentPoint: currentPoint,
					lastPointNonTransformed: lastPointNonTransformed,
					currentPointNonTransformed: currentPointNonTransformed,
					containerElement: this._activeCanvas.parentNode.parentNode,
					mouseButton: e.button,
					color: toolState.color,
					size: toolState.size
				});
				toolState.lastPoint = currentPoint;
				toolState.lastPointNonTransformed = currentPointNonTransformed;

				if (toolState.tool.causesChange) {
					this._currentBoundingBox.append(toolState.tool.getBoundsAt(currentPoint, toolState.size));
					this._currentBoundingBox.append(toolState.tool.getBoundsAt(lastPoint, toolState.size));
				}
			} else if (this._adhocTransformer && this._adhocTransformer.transformOnHover) {
				var toolSize = this._lastToolState && this._lastToolState.size;
				currentPoint = this._adhocTransformer.transform(lastPoint, currentPoint, toolSize);
			}

			this._doOverlay(currentPoint);
		},

		_onMouseUp: function p_onMouseUp(e) {
			e.preventDefault();

			var toolState = this._getToolStateForButton(e.button);
			var currentPointNonTransformed = this._getCurrentPoint(e);
			var currentPoint = this._pointTransformer.transform(currentPointNonTransformed);

			if (toolState.down) {
				toolState.down = false;
				toolState.lastPoint = null;

				if (toolState.tool.causesChange) {
					this._finishUndoRedo(toolState.tool, currentPoint, toolState.size);
					this._messageBus.publish('canvasContentChange', this._activeCanvas);
				}
			}

			this._doOverlay(currentPoint);
		},

		_onMouseOut: function(e) {
			e.preventDefault();

			this._clear(this._overlay);

			var activeToolState = null;

			var toolStates = [this._leftToolState, this._rightToolState];

			for (var i = 0; i < toolStates.length; ++i) {
				var toolState = toolStates[i];

				if (toolState.down) {
					activeToolState = toolState;
				}

				toolState.down = false;
				toolState.lastPoint = null;
			}

			if (activeToolState) {
				var currentPointNonTransformed = this._getCurrentPoint(e);
				var currentPoint = this._pointTransformer.transform(currentPointNonTransformed);

				if (activeToolState.tool.causesChange) {
					this._finishUndoRedo(this._lastToolState.tool, currentPoint);
					this._messageBus.publish('canvasContentChange', this._activeCanvas);
				}
			}

			this._messageBus.publish('canvasMouseCoordinatesChanged', null);
		},

		_pruneUndoRedoStates: function() {
			this._undoRedoStates = this._undoRedoStates.slice(0, this._currentUndoRedoStateIndex + 1);
			this._currentUndoredoStateIndex = this._undoRedoStates.length - 1;
		},

		_finishUndoRedo: function(tool, point, size) {
			this._currentBoundingBox.append(tool.getBoundsAt(point, size));

			var boundingBox = this._currentBoundingBox.boundingBox;

			if (boundingBox.hasArea) {
				this._undoRedoStates.push({
					boundingBox: boundingBox,
					undoClip: this._createClip(this._activeCanvas, boundingBox),
					redoClip: this._createClip(this._scratch, boundingBox),
					canvas: this._activeCanvas
				});

				this._currentUndoRedoStateIndex = this._undoRedoStates.length - 1;
			}

			this._applyClip(this._activeCanvas, this._scratch, this._entireBoundingBox);
			this._clear(this._scratch);
		},

		_onContextMenu: function p_onContextMenu(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},

		_clear: function(canvas) {
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		},

		_createClip: function(canvas, boundingBox) {
			var clipCanvas = LTP.util.canvas(boundingBox);

			clipCanvas.getContext('2d').drawImage(canvas, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height, 0, 0, boundingBox.width, boundingBox.height);

			return clipCanvas;
		},

		_applyClip: function(destination, source, boundingBox, clearFirst) {
			var destContext = destination.getContext('2d');

			if (typeof source.getContext === 'function') {
				if (clearFirst) {
					destContext.clearRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
				}
				destContext.drawImage(source, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
			} else {
				destContext.putImageData(source, boundingBox.x, boundingBox.y);
			}
		},

		undo: function() {
			if (this._currentUndoRedoStateIndex > - 1) {
				var state = this._undoRedoStates[this._currentUndoRedoStateIndex];

				this._applyClip(state.canvas, state.undoClip, state.boundingBox, true);
				this._messageBus.publish('canvasContentChange', this._activeCanvas);
				this._currentUndoRedoStateIndex -= 1;
			}
		},

		redo: function() {
			if (this._currentUndoRedoStateIndex < this._undoRedoStates.length - 1) {
				this._currentUndoRedoStateIndex += 1;

				var state = this._undoRedoStates[this._currentUndoRedoStateIndex];

				this._applyClip(state.canvas, state.redoClip, state.boundingBox, false);
				this._messageBus.publish('canvasContentChange', this._activeCanvas);
			}
		},

		_onZoomChanged: function(newZoom) {
			this._zoom = newZoom;
			this._pointTransformer.zoom = newZoom;
		},

		_onActiveLayerChanged: function(newLayer) {
			this.activeCanvas = newLayer;
		},

		_onLeftColorSelected: function(color) {
			this._leftToolState.color = color;
			this._lastToolState = this._leftToolState;
		},

		_onRightColorSelected: function(color) {
			this._rightToolState.color = color;
			this._lastToolState = this._rightToolState;
		},

		_onLeftSizeSelected: function(size) {
			this._leftToolState.size = size;
		},

		_onRightSizeSelected: function(size) {
			this._rightToolState.size = size;
		},

		_onCursorDisplayChangeRequest: function p_onCursorDisplayChangeRequest(cursorDisplay) {
			this._overlay.style.cursor = cursorDisplay;
		}
	};

	Object.defineProperty(LTP.Painter.prototype, "overlay", {
		get: function() {
			return this._overlay;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "scratch", {
		get: function() {
			return this._scratch;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "activeCanvas", {
		set: function(canvas) {
			this._activeCanvas = canvas;
		}
	});

	Object.defineProperty(LTP.Painter.prototype, "leftTool", {
		get: function() {
			return this._leftToolState.tool;
		},
		set: function(tool) {
			this._leftToolState.tool = tool;
			this._lastToolState = this._leftToolState;
			this._messageBus.publish('leftToolChanged', tool);
			this._doOverlay();
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "rightTool", {
		get: function() {
			return this._rightToolState.tool;
		},
		set: function(tool) {
			this._rightToolState.tool = tool;
			this._lastToolState = this._rightToolState;
			this._messageBus.publish('rightToolChanged', tool);
			this._doOverlay();
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "leftColor", {
		get: function() {
			return this._leftToolState.color;
		},
		set: function(color) {
			this._leftToolState.color = color;
			this._lastToolState = this._leftToolState;
			this._doOverlay();
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "rightColor", {
		get: function() {
			return this._rightToolState.color;
		},
		set: function(color) {
			this._rightToolState.color = color;
			this._lastToolState = this._rightToolState;
			this._doOverlay();
		},
		enumerable: true
	});

	Object.defineProperty(LTP.Painter.prototype, "adhocTransformer", {
		set: function(transformer) {
			this._adhocTransformer = transformer;
			this._doOverlay();
		},
	});

})();


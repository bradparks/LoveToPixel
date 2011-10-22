(function() {
	LTP.Painter = function(size, pointTransformer, messageBus, leftTool, rightTool) {
		if(!size) {
			throw new Error("LTP.Painter: size is required");
		}

		if(!pointTransformer) {
			throw new Error("LTP.Painter: pointTransformer is required");
		}

		this._messageBus = messageBus || LTP.GlobalMessageBus;
		this._messageBus.subscribe('zoomChanged', this._onZoomChanged, this);

		this._overrideToolState = { down: false, active: false };
		this._leftToolState = { down: false };
		this._rightToolState = { down: false };

		this.leftTool = leftTool || new LTP.BrushTool('#000000', 1);
		this.rightTool = rightTool || new LTP.BrushTool('#FFFFFF', 1);

		this._lastToolState = this._leftToolState;
	
		this._size = size;
		this._pointTransformer = pointTransformer;

		this._overlay = LTP.util.canvas(this._size, { position: 'absolute', top: 0, left: 0 });
		this._scratch = LTP.util.canvas(this._size, { position: 'absolute', top: 0, left: 0 });

		this._clear(this._overlay);
		this._clear(this._scratch);

		this._hook(this._overlay);

		this._undoRedoStates = [];
		this._currentUndoRedoStateIndex = -1;
		this._entireBoundingBox = r(0, 0, this._size.width, this._size.height);
	};	
	
	LTP.Painter.prototype = {
		get overlay() {
			return this._overlay;
		},

		get scratch() {
			return this._scratch;
		},

		set activeCanvas(canvas) {
			this._activeCanvas = canvas;
		},

		set leftTool(tool) {
			this._leftToolState.tool = tool;
			this._messageBus.publish('leftToolChanged', tool);
		},

		get leftTool() {
			if(this._overrideToolState.active) {
				return this._overrideToolState.tool;
			} else {
				return this._leftToolState.tool;
			}
		},

		set rightTool(tool) {
			this._rightToolState.tool = tool;
			this._messageBus.publish('rightToolChanged', tool);
		},

		get rightTool() {
			if(this._overrideToolState.active) {
				return this._overrideToolState.tool;
			} else {
				return this._rightToolState.tool;
			}
		},

		pushOverrideTool: function(overrideTool) {
			this._overrideToolState.tool = overrideTool;
			this._overrideToolState.active = true;
			this._lastToolState = this._overrideToolState;
			this._doOverlay();
		},

		popOverrideTool: function() {
			delete this._overrideToolState.tool;
			this._overrideToolState.active = false;
			this._lastToolState = this._leftToolState;
			this._doOverlay();
		},

		destroy: function() {
			this._messageBus.unsubscribe('zoomChanged', this._onZoomChanged);
		},

		_hook: function p_hook(canvas) {
			this._setEventListeners(canvas, 'add');
		},

		_unhook: function p_unhook(canvas) {
			this._setEventListeners(canvas, 'remove');
		},

		_setEventListeners: function p_setEventListeners(canvas, prefix) {
			canvas[prefix + 'EventListener']('mousedown', LTP.util.bind(this._onMouseDown, this), false);
			canvas[prefix + 'EventListener']('mousemove', LTP.util.bind(this._onMouseMove, this), false);
			canvas[prefix + 'EventListener']('mouseout', LTP.util.bind(this._onMouseOut, this), false);
			canvas[prefix + 'EventListener']('mouseup', LTP.util.bind(this._onMouseUp, this), false);
			canvas[prefix + 'EventListener']('contextmenu', LTP.util.bind(this._onContextMenu, this), false);
		},

		_getToolStateForButton: function(button) {
			if(this._overrideToolState.active) {
				return this._overrideToolState;
			}

			if(button === 0) {
				return this._leftToolState;
			}

			return this._rightToolState;
		},

		_onMouseDown: function p_onMouseDown(e) {
			e.preventDefault();
			this._clear(this._overlay);


			var toolState = this._getToolStateForButton(e.button);
			var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));
	
			// prevent painting if switching tools
			if(toolState && toolState == this._lastToolState) {
				if(toolState.tool.causesChange) {
					this._pruneUndoRedoStates();
				}

				toolState.down = true;
				var lastPoint = toolState.lastPoint || currentPoint;
				
				var canvas = toolState.tool.causesChange ? this._scratch : this._activeCanvas;

				toolState.tool.perform(canvas.getContext('2d'), lastPoint, currentPoint);
				
				toolState.lastPoint = currentPoint;
				
				if(toolState.tool.causesChange) {
					this._currentBoundingBox = new LTP.BoundingBoxBuilder(toolState.tool.getBoundsAt(currentPoint));
					this._currentBoundingBox.append(toolState.tool.getBoundsAt(lastPoint));
				}

			}

			if(toolState) {
				this._lastToolState = toolState;
			}

			this._doOverlay(currentPoint);
		},

		_onMouseMove: function p_onMouseMove(e) {
			e.preventDefault();

			var toolState = this._getToolStateForButton(e.button);
			
			var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));

			if(toolState && toolState.down) {
				var lastPoint = toolState.lastPoint || currentPoint;
				toolState.tool.perform(this._scratch.getContext('2d'), lastPoint, currentPoint);
				toolState.lastPoint = currentPoint;

				if(toolState.tool.causesChange) {
					this._currentBoundingBox.append(toolState.tool.getBoundsAt(currentPoint));
					this._currentBoundingBox.append(toolState.tool.getBoundsAt(lastPoint));
				}
			}

			this._doOverlay(currentPoint);
		},

		_doOverlay: function p_doOverlay(point) {
				var point = point || this._lastOverlayPoint;

				if(point) {
					this._clear(this._overlay);
					this._lastToolState.tool.overlay(this._overlay.getContext('2d'), point);
					this._lastOverlayPoint = point;
				}

				this._messageBus.publish('canvasMouseCoordinatesChanged', point);
		},

		_onMouseUp: function p_onMouseUp(e) {
			e.preventDefault();

			var toolState = this._getToolStateForButton(e.button);
			var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));

			if(toolState) {
				toolState.down = false;
				toolState.lastPoint = null;


				if(toolState.tool.causesChange) {
					this._finishUndoRedo(toolState.tool, currentPoint);
				}
			}

			this._doOverlay(currentPoint);
		},

		_onMouseOut: function(e) {
			this._clear(this._overlay);

			var activeToolState = null;

			var toolStates = [
				this._leftToolState,
				this._rightToolState,
				this._overrideToolState
			];

			for(var i = 0; i < toolStates.length; ++i) {
				var toolState = toolStates[i];

				if(toolState.down) {
					activeToolState = toolState;
				}

				toolState.down = false;
				toolState.lastPoint = null;
			}

			if(activeToolState) {
				var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));

				if(activeToolState.tool.causesChange) {
					this._finishUndoRedo(this._lastToolState.tool, currentPoint);
				}
			}

			this._messageBus.publish('canvasMouseCoordinatesChanged', null);
		},

		_pruneUndoRedoStates: function() {
			this._undoRedoStates = this._undoRedoStates.slice(0, this._currentUndoRedoStateIndex + 1);
			this._currentUndoredoStateIndex = this._undoRedoStates.length - 1;
		},

		_finishUndoRedo: function(tool, point) {
			this._currentBoundingBox.append(tool.getBoundsAt(point));
				
			var boundingBox = this._currentBoundingBox.boundingBox;

			this._undoRedoStates.push({
				boundingBox: boundingBox,
				undoClip: this._createClip(this._activeCanvas, boundingBox),
				redoClip: this._createClip(this._scratch, boundingBox)
			});

			this._applyClip(this._activeCanvas, this._scratch, this._entireBoundingBox);
			this._clear(this._scratch);
			this._currentUndoRedoStateIndex = this._undoRedoStates.length - 1;
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

		_applyClip: function(destination, source, boundingBox) {
			var destContext = destination.getContext('2d');

			if(typeof source.getContext === 'function') {
				destContext.drawImage(source, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
			} else {
				destContext.putImageData(source, boundingBox.x, boundingBox.y);
			}
		},

		undo: function() {
			if(this._currentUndoRedoStateIndex > -1) {

				var state = this._undoRedoStates[this._currentUndoRedoStateIndex];

				this._applyClip(this._activeCanvas, state.undoClip, state.boundingBox);
				--this._currentUndoRedoStateIndex;
			}
		},

		redo: function() {
			if(this._currentUndoRedoStateIndex < this._undoRedoStates.length - 1) {
				this._currentUndoRedoStateIndex += 1;
		
				var state = this._undoRedoStates[this._currentUndoRedoStateIndex];
		
				this._applyClip(this._activeCanvas, state.redoClip, state.boundingBox);
			}
		},

		_onZoomChanged: function p_onZoomChanged(newZoom) {
			this._pointTransformer.zoom = newZoom;
		}

	};

})();

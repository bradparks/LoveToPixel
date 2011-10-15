(function() {
	LTP.Painter = function(size, pointTransformer) {
		if(!size) {
			throw new Error("LTP.Painter: size is required");
		}

		if(!pointTransformer) {
			throw new Error("LTP.Painter: pointTransformer is required");
		}

		this._toolState = [
			{ down: false, lastPoint: undefined, tool: undefined }, // 0 -- almost always left
			{ down: false, lastPoint: undefined, tool: undefined }, // 1 -- usually right, sometimes middle?
			{ down: false, lastPoint: undefined, tool: undefined }  // 2 -- sometimes right, usually middle?
		];

		this._lastToolState = this._toolState[0];
	
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
			this._toolState[0].tool = tool;
		},

		set rightTool(tool) {
			this._toolState[1].tool = tool;
			this._toolState[2].tool = tool;
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

		_onMouseDown: function p_onMouseDown(e) {
			e.preventDefault();
			this._clear(this._overlay);
			this._pruneUndoRedoStates();

			var toolState = this._toolState[e.button];
			var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));


			if(toolState) {
				toolState.down = true;
				var lastPoint = toolState.lastPoint || currentPoint;
				
				toolState.tool.perform(this._scratch.getContext('2d'), lastPoint, currentPoint);
				
				toolState.lastPoint = currentPoint;
				
				this._currentBoundingBox = new LTP.BoundingBoxBuilder(toolState.tool.getBoundsAt(currentPoint));
				this._currentBoundingBox.append(toolState.tool.getBoundsAt(lastPoint));

				this._lastToolState = toolState;
			}

			this._doOverlay(currentPoint);
		},

		_onMouseMove: function p_onMouseMove(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			
			var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));

			if(toolState && toolState.down) {
				var lastPoint = toolState.lastPoint || currentPoint;
				toolState.tool.perform(this._scratch.getContext('2d'), lastPoint, currentPoint);
				toolState.lastPoint = currentPoint;

				// TODO: it's technically possible this isn't capturing the whole bounding box
				this._currentBoundingBox.append(toolState.tool.getBoundsAt(currentPoint));
				this._currentBoundingBox.append(toolState.tool.getBoundsAt(lastPoint));
			}

			this._doOverlay(currentPoint);
		},

		_doOverlay: function p_doOverlay(point) {
				this._clear(this._overlay);
				this._lastToolState.tool.overlay(this._overlay.getContext('2d'), point);
		},

		_onMouseUp: function p_onMouseUp(e) {
			e.preventDefault();

			var toolState = this._toolState[e.button];
			if(toolState) {
				toolState.down = false;
				toolState.lastPoint = null;

				var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));
				this._finishUndoRedo(toolState.tool, currentPoint);
			}
		},

		_onMouseOut: function(e) {
			this._clear(this._overlay);

			var activeToolState = null;

			for(var i = 0; i < this._toolState.length; ++i) {
				if(this._toolState[i].down) {
					activeToolState = this._toolState[i];
				}

				this._toolState[i].down = false;
				this._toolState[i].lastPoint = null;
			}

			if(activeToolState) {
				var currentPoint = this._pointTransformer.transform(p(e.offsetX, e.offsetY));
				this._finishUndoRedo(this._lastToolState.tool, currentPoint);
			}
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
			//return canvas.getContext('2d').getImageData(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

			var clipCanvas = LTP.util.canvas(boundingBox);

			clipCanvas.getContext('2d').drawImage(canvas, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height, 0, 0, boundingBox.width, boundingBox.height);

			return clipCanvas;
		},

		_applyClip: function(destination, source, boundingBox) {
			if(typeof source.getContext === 'function') {
				destination.getContext('2d').drawImage(source, boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
			} else {
				destination.getContext('2d').putImageData(source, boundingBox.x, boundingBox.y);
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
		}
	};

})();

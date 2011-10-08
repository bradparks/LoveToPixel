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

		this._overlay = document.createElement('canvas');
		this._overlay.width = this._size.width;
		this._overlay.height = this._size.height;

		this._clear(this._overlay);
		this._hook(this._overlay);
	};	
	
	LTP.Painter.prototype = {
		get overlay() {
			return this._overlay;
		},
		set activeCanvas(canvas) {
			if(this._activeCanvas) {
				//this._unhook(this._activeCanvas);
			}

			//this._hook(canvas);
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

			var toolState = this._toolState[e.button];
			var currentPoint = this._pointTransformer.transform(p(e.clientX, e.clientY));

			if(toolState) {
				toolState.down = true;
				var lastPoint = toolState.lastPoint || currentPoint;
				toolState.tool.perform(this._activeCanvas.getContext('2d'), lastPoint, currentPoint);
				toolState.lastPoint = currentPoint;
				this._lastToolState = toolState;
			}

			this._doOverlay(currentPoint);
		},
		_onMouseMove: function p_onMouseMove(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			
			if(!toolState.down) {
				toolState = this._lastToolState;
			}

			var currentPoint = this._pointTransformer.transform(p(e.clientX, e.clientY));

			if(toolState) {
				if (toolState.down) {
					var lastPoint = toolState.lastPoint || currentPoint;
					toolState.tool.perform(this._activeCanvas.getContext('2d'), lastPoint, currentPoint);
					toolState.lastPoint = currentPoint;
				} 
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
			}
		},
		_onMouseOut: function() {
			this._clear(this._overlay);
			for(var i = 0; i < this._toolState.length; ++i) {
				this._toolState[i].down = false;
				this._toolState[i].lastPoint = null;
			}
		},
		_onContextMenu: function p_onContextMenu(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		_clear: function(canvas) {
			var context = canvas.getContext('2d');
			//context.save();
			//context.fillStyle = 'green';// 'rgba(0,0,0,0)';
			//context.fillRect(0, 0, canvas.width, canvas.height);
			//context.restore();
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

})();

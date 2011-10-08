(function() {
	LTP.Painter = function(pointTransformer) {
		if(!pointTransformer) {
			throw new Error("LTP.Painter: pointTransformer is required");
		}

		this._toolState = [
			{ down: false, lastPoint: undefined, tool: undefined }, // 0 -- almost always left
			{ down: false, lastPoint: undefined, tool: undefined }, // 1 -- usually right, sometimes middle?
			{ down: false, lastPoint: undefined, tool: undefined }  // 2 -- sometimes right, usually middle?
		];
	
		this._pointTransformer = pointTransformer;
	};
	
	LTP.Painter.prototype = {
		set activeCanvas(canvas) {
			if(this._activeCanvas) {
				this._unhook(this._activeCanvas);
			}

			this._hook(canvas);
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
			canvas[prefix + 'EventListener']('mouseup', LTP.util.bind(this._onMouseUp, this), false);
			canvas[prefix + 'EventListener']('contextmenu', LTP.util.bind(this._onContextMenu, this), false);
		},
		_onMouseDown: function p_onMouseDown(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			var currentPoint = this._pointTransformer.transform(p(e.clientX, e.clientY));

			if(toolState) {
				toolState.down = true;
				var lastPoint = toolState.lastPoint || currentPoint;
				toolState.tool.perform(this._activeCanvas.getContext('2d'), lastPoint, currentPoint);
				toolState.lastPoint = currentPoint;
			}
		},
		_onMouseMove: function p_onMouseMove(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			var currentPoint = this._pointTransformer.transform(p(e.clientX, e.clientY));

			if(toolState && toolState.down) {
				var lastPoint = toolState.lastPoint || currentPoint;
				toolState.tool.perform(this._activeCanvas.getContext('2d'), lastPoint, currentPoint);
				toolState.lastPoint = currentPoint;
			}
		},
		_onMouseUp: function p_onMouseUp(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			if(toolState) {
				toolState.down = false;
				toolState.lastPoint = null;
			}
		},
		_onContextMenu: function p_onContextMenu(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	};

})();

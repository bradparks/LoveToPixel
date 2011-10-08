(function() {
	LTP.Painter = function() {
		this._toolState = [
			{ down: false, lastPoint: undefined, tool: undefined }, // 0 -- almost always left
			{ down: false, lastPoint: undefined, tool: undefined }, // 1 -- usually right, sometimes middle?
			{ down: false, lastPoint: undefined, tool: undefined }  // 2 -- sometimes right, usually middle?
		];
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
		_transform: function(point) {
			var zoom = 2;
			var restore = 1 / zoom;
			var xOffset = window.pageXOffset * restore;
			var yOffset = window.pageYOffset * restore;

			return p(point.x * restore + xOffset, point.y * restore + yOffset);
		},
		_onMouseDown: function p_onMouseDown(e) {
			e.preventDefault();
			var toolState = this._toolState[e.button];
			var currentPoint = p(e.x, e.y);
			currentPoint = this._transform(currentPoint);

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
			var currentPoint = p(e.clientX, e.clientY);
			currentPoint = this._transform(currentPoint);

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

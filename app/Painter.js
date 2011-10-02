(function() {
	LTP.Painter = function() {
	};
	
	LTP.Painter.prototype = {
		set activeCanvas(canvas) {
			if(this._activeCanvas) {
				this._unhook(this._activeCanvas);
			}

			this._hook(canvas);
			this._activeCanvas = canvas;
		},

		_hook: function p_hook(canvas) {
			this._setEventListeners(canvas, 'add');
		},
		_unhook: function p_unhook(canvas) {
			this._setEventListeners(canvas, 'remove');
		},
		_setEventListeners: function p_setEventListeners(canvas, prefix) {
			canvas[prefix + 'EventListener']('mousedown', LTP.util.bind(this._onMouseDown, this), false);
		},
		_onMouseDown: function p_onMouseDown(e) {
		}
	};

})();

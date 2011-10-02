(function() {
	LTP.BrushTool = function(color, size) {
		if(!color) {
			throw new Error("BrushTool: color must be specified");
		}
		if(!size) {
			throw new Error("BrushTool: size must be specified");
		}

		this._color = color;
		this._size = size;
	};

	LTP.BrushTool.prototype = {
		perform: function bt_perform(context, position) {
			context.save();
			context.fillStyle = this._color;
			context.fillRect(position.x, position.y, this._size, this._size);
			context.restore();
		}
	};
})();

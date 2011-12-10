(function() {
	LTP.EraserTool = function() {
		LTP.BrushTool.call(this);
		this._cursor = 'url(images/cursors/Eraser.png), auto';
	};

	LTP.EraserTool.prototype = new LTP.BrushTool();

	LTP.EraserTool.prototype._performRect = function() {
		this.clearRect.apply(this, arguments);
	};
})();

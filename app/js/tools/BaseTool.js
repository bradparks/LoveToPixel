(function() {
	LTP.BaseTool = function(causesChange, cursor) {
		this._causesChange = causesChange;
		this._cursor = cursor;
	};

	LTP.BaseTool.prototype = {
		perform: function(e) {},

		overlay: function(context, point) {
			context.save();

			context.fillStyle = colors.purple;
			context.fillRect(point.x, point.y, 1, 1);

			context.restore();
		}
	};

	Object.defineProperty(LTP.BaseTool.prototype, "causesChange", {
		get: function() {
			return this._causesChange;
		},
		enumerable: true
	});

	Object.defineProperty(LTP.BaseTool.prototype, "cursor", {
		get: function() {
			return this._cursor;
		},
		enumerable: true
	});
})();


(function() {
	LTP.BaseTool = function(causesChange, cursor) {
		this._causesChange = causesChange;
		this._cursor = cursor;
	};

	LTP.BaseTool.prototype = {
		perform: function(e) {},

		_dropPoint: function(context, point, xOff, yOff) {
			if(point.x + xOff >= 0 && point.x + xOff < context.canvas.width
				&& point.y + yOff >= 0 && point.y + yOff < context.canvas.height) {
				context.fillRect(point.x + xOff, point.y + yOff, 1, 1);
			}
		},

		overlay: function(context, point) {
			context.save();
			context.globalCompositeOperation = 'lighter';

			context.fillStyle = this.overlayColor || 'rgba(255, 0, 0, .5)';
			// center
			this._dropPoint(context, point, 0, 0);

			context.fillStyle = this.overlayColor || 'rgba(255, 0, 255, .5)';
			
			// left
			this._dropPoint(context, point, -2, 0);
			// right
			this._dropPoint(context, point, 2, 0);
			// top
			this._dropPoint(context, point, 0, -2);
			// bottom
			this._dropPoint(context, point, 0, 2);

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


(function() {
	LTP.version = "0.1 beta";

	LTP.s = function(w,h) {
		return new LTP.Pair(w, h);
	};

	LTP.sr = function(w,h) {
		return new LTP.Pair(Math.round(w), Math.round(h));
	};

	LTP.r = function() {
		if(arguments.length === 4) {
			return new LTP.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
		} else {
			var p = arguments[0];
			return new LTP.Rectangle(p.x, p.y, arguments[1], arguments[2]);
		}
	};

	LTP.util.global.s = LTP.p = LTP.util.global.p = LTP.s;
	LTP.util.global.sr = LTP.pr = LTP.util.global.pr = LTP.sr;
	LTP.util.global.r = LTP.r;

	LTP.GlobalMessages = [
		'colorSampled',
		'zoomChanged',
		'canvasMouseCoordinatesChanged',
		'gridCellSizeChanged',
		'leftToolChanged',
		'rightToolChanged',
		'leftColorSelected',
		'rightColorSelected',
		'leftSizeSelected',
		'rightSizeSelected',
		'newLayerCreated',
		'activeLayerChanged',
		'lockChanged',
		'cursorDisplayChangeRequest',
		'flairMessage',
		'canvasContentChange',
		'paletteContentChange',
		'layerLoad',
		'layerRemoved',
		'noLayersInProject'
	];

	LTP.GlobalMessageBus = new LTP.MessageBus(LTP.GlobalMessages);

})();


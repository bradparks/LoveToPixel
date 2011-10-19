(function() {
	LTP.s = function LTP_s(w,h) {
		return new LTP.Pair(w, h);
	};

	LTP.r = function LTP_r() {
		if(arguments.length === 4) {
			return new LTP.Rectangle(arguments[0], arguments[1], arguments[2], arguments[3]);
		} else {
			var p = arguments[0];
			return new LTP.Rectangle(p.x, p.y, arguments[1], arguments[2]);
		}
	};

	LTP.util.global.s = LTP.p = LTP.util.global.p = LTP.s;
	LTP.util.global.r = LTP.r;

	LTP.GlobalMessages = [
		'colorSampled'
	];

	LTP.GlobalMessageBus = new LTP.MessageBus(LTP.GlobalMessages);

})();


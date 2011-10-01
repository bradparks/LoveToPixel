(function() {
	var global = global || window;
	global.LTP = global.LTP || {};

	LTP.util = {
		ns: function() {
			for(var i = 0, il = arguments.length; i < il; ++i) {
				var s = arguments[i].split('.');

				var root = s.indexOf("LTP") === 0 ? window : LTP;
				for(var k = 0, kl = s.length; k < kl; ++k) {
					if(root[s[k]] === undefined) {
						root[s[k]] = {};
					}
					root = root[s[k]];
				}
			}
		},

		bind: function(fn, scope) {
			return function() {
				fn.apply(scope, arguments);
			}
		}
	};
	
})();

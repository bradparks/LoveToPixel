(function() {
	function returnGlobal() {
		return this;
	}

	global = returnGlobal.call(null);

	global.LTP = global.LTP || {};

	LTP.util = {
		get global() {
			return global;
		},
		ns: function() {
			for(var i = 0, il = arguments.length; i < il; ++i) {
				var s = arguments[i].split('.');

				var root = s.indexOf("LTP") === 0 ? global : LTP;
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
		},

		canvas: function(size, styles) {
			var canvas = document.createElement('canvas');
			canvas.width = size.width;
			canvas.height = size.height;

			if(styles) {
				for(var style in styles) {
					if(styles.hasOwnProperty(style)) {
						canvas.style[style] = styles[style];
					}
				}
			}

			return canvas;
		}
	};
	
})();

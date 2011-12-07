(function() {
	function returnGlobal() {
		return this;
	}

	function getPlatformInfo() {
		var ua = navigator.userAgent;
		var platform = navigator.platform;

		info = {};
		info.isOSX = (/Mac/i).test(platform);
		info.isWindows = (/Windows/i).test(platform);
		info.isLinux = (/Linux/i).test(platform);
		info.isChrome = (/Chrome/i).test(ua);
		info.isSafari = (/Safari/i).test(ua) && ! info.isChrome;
		info.isFirefox = (/Firefox/i).test(ua);
		info.isIE = (/MSIE/).test(ua) && info.isWindows;
		info.isOpera = (/Opera/i).test(ua);

		return info;
	}

	var global = returnGlobal.call(null);

	global.LTP = global.LTP || {};

	LTP.util = {
		platformInfo: getPlatformInfo(),
		ns: function() {
			for (var i = 0, il = arguments.length; i < il; ++i) {
				var s = arguments[i].split('.');

				var root = s.indexOf("LTP") === 0 ? global: LTP;
				for (var k = 0, kl = s.length; k < kl; ++k) {
					if (root[s[k]] === undefined) {
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

		toArray: function(arg) {
			// so far this only converts arguments to an array
			// will most likely wipe out this entire class with equivalents in Ext4
			var result = [];

			for (var i = 0; i < arg.length; ++i) {
				result.push(arg[i]);
			}

			return result;
		},

		canvas: function(size, styles) {
			var canvas = document.createElement('canvas');
			canvas.width = size.width;
			canvas.height = size.height;

			if (styles) {
				for (var style in styles) {
					if (styles.hasOwnProperty(style)) {
						canvas.style[style] = styles[style];
					}
				}
			}

			this.setImageRendering(canvas);

			return canvas;
		},

		setImageRendering: function(element) {
			var rendering = 'optimizeSpeed';
			if (this.platformInfo.isChrome) {
				rendering = '-webkit-optimize-contrast';
			}
			else if (this.platformInfo.isFirefox) {
				rendering = '-moz-crisp-edges';
			}

			element.style.imageRendering = rendering;
		},

		scaleSize: function(size, maxSize) {
			if (size.width <= maxSize.width && size.height <= maxSize.height) {
				return s(size.width, size.height);
			}

			var widthScale = maxSize.width / size.width;
			var heightScale = maxSize.height / size.height;
			var scale = Math.min(widthScale, heightScale);

			return sr(size.width * scale, size.height * scale);
		},

		waitFor: function(predicate, callback) {
			if (predicate()) {
				callback();
			} else {
				var me = this;
				setTimeout(function() {
					me.waitFor(predicate, callback)
				},
				50);
			}
		}
	};

	Object.defineProperty(LTP.util, "global", {
		get: function() {
			return global;
		},
		enumerable: true
	});

})();


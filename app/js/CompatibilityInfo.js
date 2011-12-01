(function() {
	var _resolutionMessages = [
		'You will not be able to use some minor features',
		'LTP will work but will be problematic',
		'LTP is completely unusable with this browser'
	];

	LTP.compatibilityInfo = function() {
		var info = {
			'Object.defineProperty': {
				available: (function() {
					if (typeof Object.defineProperty !== 'function') {
						return false;
					}

					var elements = [document.createElement('div'), {}];
					try {
						for (var i = 0; i < elements.length; ++i) {
							var e = elements[i];
							Object.defineProperty(e, "definePropTest", {
								get: function() {
									return 41;
								}
							});
							if (e.definePropTest !== 41) {
								return false;
							}
						}
					} catch(e) {
						return false;
					}

					return true;
				})(),
				message: 'Object.defineProperty is missing',
				resolution: 2
			},
			canvas: {
				available: !! window.HTMLCanvasElement,
				message: 'canvas is missing',
				resolution: 2
			},
			'image-rendering': {
				available: (function() {
					var hasIt = false;

					if (LTP.util.platformInfo.isChrome) {
						hasIt = LTP.util.platformInfo.isOSX;
					}
					if (LTP.util.platformInfo.isFirefox) {
						hasIt = true;
					}
					return hasIt;
				})(),
				message: 'nearest neighbor for image-rendering is missing',
				resolution: 1
			},
			'FileReader': {
				available: !! window.FileReader,
				message: 'FileReader is missing',
				resolution: 0
			},
			'Internet Explorer': {
				available: ! LTP.util.platformInfo.isIE,
				message: 'IE is not yet supported',
				resolution: 2
			},
			'Opera': {
				available: ! LTP.util.platformInfo.isOpera,
				message: 'Opera is not yet supported',
				resolution: 2
			}
		};

		var success = true;
		var maxResolution = -1;
		for (var prop in info) {
			if (info.hasOwnProperty(prop)) {
				success = success && info[prop].available;
				if(!info[prop].available) {
					maxResolution = Math.max(maxResolution, info[prop].resolution);
				}
					
			}
		}
		info.success = success;
		info.resolution = maxResolution > -1 ? _resolutionMessages[maxResolution] : '';

		return info;
	};
})();


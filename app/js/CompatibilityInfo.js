LTP.compatibilityInfo = function() {
	var info = {
		canvas: {
			available: !!window.HTMLCanvasElement,
			message: 'Your browser lacks canvas support.'
		},
		'image-rendering': {
			available: (function() {
				var hasIt = false;

				if(LTP.util.platformInfo.isChrome) {
					hasIt = LTP.util.platformInfo.isOSX;
				}
				if(LTP.util.platformInfo.isFirefox) {
					hasIt = true;
				}
				return hasIt;
			})(),
			message: 'Your browser does not support a nearest-neighbor choice for the css image-rendering property, or its support is buggy.'
		},
		'FileReader': {
			available: !!window.FileReader,
			message: 'Your browser lacks the FileReader API.'
		},
		'Internet Explorer': {
			available: !LTP.util.platformInfo.isIE,
			message: 'Currently LTP does not work in any version of Internet Explorer. Support for IE9 is on its way.'
		},
		'Opera' : {
			available: !LTP.util.platformInfo.isOpera,
			message: 'LTP does not work in any version of Opera yet. Support is on its way.'
		}
	};

	var success = true;
	for(var prop in info) {
		if(info.hasOwnProperty(prop)) {
			success = success && info[prop].available;
		}
	}
	info.success = success;

	return info;
};


(function() {
	LTP.compatibilityInfo = function() {
		var info = {
			desktop: {
				available: Ext.is.Desktop,
				message: 'LTP does not work on mobile devices yet',
				severity: 4
			},
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
				severity: 3
			},
			canvas: {
				available: !! window.HTMLCanvasElement,
				message: 'canvas is missing',
				severity: 2
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
				message: 'nearest neighbor for image-rendering is missing (or buggy in the case of Chrome on Windows)',
				severity: 1
			},
			'FileReader': {
				available: !! window.FileReader,
				message: 'FileReader is missing (drag and drop operations won\'t be available)',
				severity: 0
			},
			'Internet Explorer': {
				available: !Ext.isIE,
				message: 'IE lacks key needed features',
				severity: 4
			},
			'Opera': {
				available: ! LTP.util.platformInfo.isOpera,
				message: 'Not all Opera issues have been resolved',
				severity: 4
			}
		};

		var success = true;
		var maxSeverity = - 1;
		var conclusion;

		for (var prop in info) {
			if (info.hasOwnProperty(prop)) {
				success = success && info[prop].available;
				if (!info[prop].available) {
					maxSeverity = Math.max(maxSeverity, info[prop].severity);
					if (maxSeverity === info[prop].severity) {
						conclusion = info[prop].message;
					}
				}

			}
		}
		info.success = success;
		info.conclusion = conclusion;

		return info;
	};
})();


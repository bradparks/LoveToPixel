(function() {

	LTP.util.global.colors = {
		black:		'#000000',
		white: 		'#FFFFFF',
		red: 			'#FF0000',
		blue: 		'#0000FF',
		green: 		'#00FF00',
		yellow: 	'#FFFF00',
		orange: 	'#FF8800',
		purple: 	'#CC00FF',
		gray:			'#888888',
		lightGray:'#BBBBBB',
		brown: 		'#773355',

		isHexString: function(colorString) {
			if(typeof colorString !== 'string') {
				return false;
			}

			if(colorString[0] !== '#' || colorString.length !== 7) {
				return false;
			}

			// Ext requires hex strings to be capital letters, so enforcing that here
			if(colorString.toUpperCase() !== colorString) {
				return false;
			}

			// this is not a definitive answer, but good enough for current purposes
			return parseInt(colorString.substring(1), 16) !== NaN;
		},

		fromArrayToHex: function(colorArray, options) {
			var hexString = '#';

			var count = (options && options.includeAlpha && colorArray.length === 4) ? 4 : 3;

			for(var i = 0; i < count; ++i) {
				var hex = colorArray[i].toString(16);
				if(hex.length < 2) {
					hex = '0' + hex;
				}
				hexString += hex;
			}
			return hexString;
		},

		fromHexToArray: function(hexColorString, options) {
			hexColorString = hexColorString.substring(1); // chop off #

			var oxr = hexColorString.substring(0, 2);
			var oxg = hexColorString.substring(2, 4);
			var oxb = hexColorString.substring(4, 6);

			result = [
				parseInt(oxr, 16),
				parseInt(oxg, 16),
				parseInt(oxb, 16),
			];

			if(options && options.includeAlpha) {
				result.push(255);
			}

			return result;
		},

		invert: function(hexColor) {
			var array = this.fromHexToArray(hexColor);

			for(var i = 0; i < array.length; ++i) {
				array[i] = 255 - array[i];
			}

			return this.fromArrayToHex(array); 
		}

	};

})();

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
		}
	};

})();

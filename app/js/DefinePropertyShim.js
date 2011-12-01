(function() {

	if(typeof Object.defineProperty !== 'function' && typeof Object.__defineGetter__ === 'function') {
		Object.defineProperty = function(obj, property, options) {
			if(typeof options.get === 'function') {
				obj.__defineGetter__(property, options.get);
			}

			if(typeof options.set === 'function') {
				obj.__defineSetter__(property, options.set);
			}

		};
	}

})();


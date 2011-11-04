(function() {
	LTP.ImageLoader = {
		load: function il_load(file, callback, errorCallback, scope) {
			if(file.type.indexOf('image/') !== 0) {
				errorCallback.call(scope, "Chosen file is not an image: " + file.name);
			} else {
				var reader = new FileReader();
				reader.onload = function(e) {
					var img = document.createElement('img');
					img.onload = function() {
						callback.call(scope, img);
					};
					img.src = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		}
	};

})();

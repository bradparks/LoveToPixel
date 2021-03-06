(function() {
	LTP.ImageLoader = {
		load: function il_load(file, callback, errorCallback, scope) {
			this.loadToDataURL(file, function(dataUrl) {
				this.fromDataUrlToImg(dataUrl, callback, scope);
			},
			function(errorMsg) {
				errorCallback.call(scope, errorMsg);
			}, this);
		},

		loadToDataURL: function(file, callback, errorCallback, scope) {
			if (file.type.indexOf('image/') !== 0) {
				errorCallback.call(scope, "Chosen file is not an image: " + file.name);
			} else {
				var reader = new FileReader();
				reader.onload = function(e) {
					callback.call(scope, e.target.result);
				};
				reader.readAsDataURL(file);
			}
		},

		fromDataUrlToImg: function(dataUrl, callback, scope) {
			var img = document.createElement('img');
			img.onload = function() {
				callback.call(scope, img);
			};
			img.src = dataUrl;
		},

		// TODO: this doesn't belong here
		createThumbnail: function(dataUrl, maxSize, callback, scope) {
			this.fromDataUrlToImg(dataUrl, function(img) {

				var canvas = document.createElement('canvas');

				var widthDelta = img.width - maxSize.width;
				var heightDelta = img.height - maxSize.height;
				var percentage;

				if (widthDelta > 0 && widthDelta > heightDelta) {
					percentage = maxSize.width / img.width;
				} else if (heightDelta > 0 && heightDelta > widthDelta) {
					percentage = maxSize.height / img.height;
				}

				if (percentage) {
					canvas.width = img.width * percentage;
					canvas.height = img.height * percentage;
				} else {
					canvas.width = img.width;
					canvas.height = img.height;
				}

				canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

				callback.call(scope, canvas.toDataURL('png'), s(canvas.width, canvas.height));
			});
		}
	};

})();


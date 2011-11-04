describe("ImageLoader", function() {
	it("should call the error callback if file is not an image", function() {
		var file = {
			type: 'notanimage/nope'
		};

		var errorCallback = function() {
			errorCallback.called = true;
		};

		LTP.ImageLoader.load(file, function() {}, errorCallback);

		expect(errorCallback.called).toBe(true);
	});
});


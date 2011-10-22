describe("KeyListener", function() {


	describe("construction", function() {
		it("should throw if no config is provided", function() {
			expect(LTP.KeyListener).toThrow(); 
		});
		
		it("should default to window if no hook is provided", function() {
			spyOn(window, "addEventListener");
			new LTP.KeyListener({});
			expect(window.addEventListener).toHaveBeenCalled();
		});

		it("should hook into the provided hook", function() {
			var hook = {
				addEventListener: function() {
				}
			};

			spyOn(hook, "addEventListener");

			new LTP.KeyListener({ hook: hook });
			expect(hook.addEventListener).toHaveBeenCalled();
		});
	});

	describe("reporting events", function() {
		it("should call the corresponding event handler for a key: keypress", function() {
			var config = {
				callbacks : {
					a: function() {}
				}
			};

			spyOn(config.callbacks, "a");

			var keyListener = new LTP.KeyListener(config);

			// I don't want to call the handler directly, but Chrome
			// has a bug where you can't simulate key events
			// http://groups.google.com/a/chromium.org/group/chromium-bugs/browse_thread/thread/eaa596661c2948b5
			keyListener._onKeyPress({
				charCode: "a".charCodeAt(0)
			});

			expect(config.callbacks.a).toHaveBeenCalled();
		});

		it("should call the corresponding event handler for a key: keydown", function() {
			var config = {
				callbacks: {
					adown: function() {}
				}
			};

			spyOn(config.callbacks, "adown");

			var keyListener = new LTP.KeyListener(config);

			keyListener._onKeyDown({
				keyCode: "a".charCodeAt(0)
			});

			expect(config.callbacks.adown).toHaveBeenCalled();
		});

		it("should call the corresponding event handler for a key: keyup", function() {
			var config = {
				callbacks: {
					aup: function() {}
				}
			};

			spyOn(config.callbacks, "aup");

			var keyListener = new LTP.KeyListener(config);

			keyListener._onKeyUp({
				keyCode: "a".charCodeAt(0)
			});

			expect(config.callbacks.aup).toHaveBeenCalled();
		});
		
	});



});


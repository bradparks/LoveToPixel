describe("MessageBus", function() {

	var messages = [ 'foo', 'bar', 'baz' ];
	var mb;

	beforeEach(function() {
		mb = new LTP.MessageBus(messages);
	});


	describe("construction", function() {
		it("should throw if no message definitions are passed in", function() {
			var fn = function() {
				new LTP.MessageBus();
			}

			expect(fn).toThrow();
		});
	});
	describe("subscribing", function() {	
		it("should deny subscribing to a message that doesn't exist", function() {
			var fn = function() {
				mb.subscribe('boo', function() {}, {});
			};

			expect(fn).toThrow();
		});

		it("should throw if subscribing without a callback", function() {
			var fn = function() {
				mb.subscribe('foo');
			};

			expect(fn).toThrow();
		});

		it("should send messages to subscribers", function() {
			var callbackCalled = false;
			var callbackArg = 'hello';

			var callback = function(arg) {
				callbackCalled = true;
				expect(arg).toEqual(callbackArg);
			};

			mb.subscribe('foo', callback);

			mb.publish('foo', callbackArg);

			expect(callbackCalled).toBe(true);
		});
	});
	
	describe("publishing", function() {
		it("should throw if trying to publish to a message that doesnt exist", function() {
			var fn = function() {
				mb.publish('doesntexist');
			};

			expect(fn).toThrow();
		});

		it("should be a no-op to publish if there are no subscribers", function() {
			var exceptionThrown = false;

			try {
				mb.publish('foo');
			} catch(e) {
				exceptionThrown = true;
			}

			expect(exceptionThrown).toBe(false);
		});
	});

	describe("unsubscribing", function() {
		it("should throw if unsubscribing from a nonexistant message", function() {
			var fn = function() {
				mb.unsubscribe('doesntexist', function() {});
			};

			expect(fn).toThrow();
		});

		it("should not complain if unsubscribe is called for a function that isnt subscribed", function() {
			var exceptionThrown = false;
			try {
				mb.unsubscribe('foo', function notRegisteredWithMessageBus() {});
			} catch(e) {
				exceptionThrown = true;
			}

			expect(exceptionThrown).toBe(false);
		});

		it("should unsubscribe", function() {
			var subscriber1 = function() {
				subscriber1.called = true;
			};

			var subscriber2 = function() {
				subscriber2.called = true;
			};

			mb.subscribe('foo', subscriber1);
			mb.subscribe('foo', subscriber2);

			mb.unsubscribe('foo', subscriber1);

			mb.publish('foo');

			expect(subscriber1.called).toBe(undefined);
			expect(subscriber2.called).toBe(true);
		});
	});

});



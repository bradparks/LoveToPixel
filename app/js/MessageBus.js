(function() {
	LTP.MessageBus = function MessageBus(messages) {
		if(!messages || !messages.length) {
			throw new Error("MessageBus: messages is required");
		}

		this._messages = messages;
		this._subscribers = {};
	};

	LTP.MessageBus.prototype = {
		subscribe: function mb_subscribe(message, callback, scope) {
			if(!this._messageExists(message)) {
				throw new Error("MessageBus.subscribe: subscribing to a nonexistant message: " + message);
			}

			if(typeof callback !== 'function') {
				throw new Error("MessageBus.subscribe: must provide a a callback when subscribing");
			}

			this._subscribers[message] = this._subscribers[message] || [];

			this._subscribers[message].push({
				scope: scope,
				callback: callback
			});
		},

		unsubscribe: function mb_unsubscribe(message, callback) {
			if(!this._messageExists(message)) {
				throw new Error("MessageBus.unsubscribe: non existant message: " + message);
			}

			var subscribers = this._subscribers[message];

			if(subscribers) {
				var subscriberIndex = -1;
				for(var i = 0; i < subscribers.length; ++i) {
					if(subscribers[i].callback === callback) {
						subscriberIndex = i;
						break;
					}
				}
				if(subscriberIndex >= 0) {
					subscribers.splice(subscriberIndex, 1);
				}
			}
		},

		publish: function mb_publish(message /* all additional args are passed into the callbacks */) {
			if(!this._messageExists(message)) {
				throw new Error("MessageBus.publish: publishing a non existant message: " + message);
			}

			var subscribers = this._subscribers[message];

			if(subscribers && subscribers.length) {
				var args = LTP.util.toArray(arguments).slice(1);
	
	
				for(var i = 0; i < subscribers.length; ++i) {
					var subscriber = subscribers[i];
	
					subscriber.callback.apply(subscriber.scope || null, args);
				}
			}
		},

		_messageExists: function mb_messageExists(message) {
			return this._messages.indexOf(message) >= 0;
		},
	};

})();

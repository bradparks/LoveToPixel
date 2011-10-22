(function() {
	LTP.KeyListener = function KeyListener(config) {
		var me = this;
		if(!config) {
			throw new Error("KeyListener: must be constructed with a config object");
		}
		this._scope = config.scope || this;
		this._hook = config.hook || window;
		this._callbacks = config.callbacks || {};
	
		this._keyPressListener = LTP.util.bind(this._onKeyPress, this);
		this._hook.addEventListener("keypress", this._keyPressListener, false);

		this._keyDownListener = LTP.util.bind(this._onKeyDown, this);
		this._hook.addEventListener("keydown", this._keyDownListener, false);

		this._keyUpListener = LTP.util.bind(this._onKeyUp, this);
		this._hook.addEventListener("keyup", this._keyUpListener, false);

		this._downKeys = {};
	};

	LTP.KeyListener.prototype = {
		_onKeyPress: function kl_onKeyPress(e) {
			var character = String.fromCharCode(e.charCode);
			character = character.toLowerCase();
		
			if(typeof this._callbacks[character] === 'function') {
				this._callbacks[character].call(this._scope, e.shiftKey);
			}
		},

		_onKeyDown: function kl_onKeyDown(e) {
			var character = String.fromCharCode(e.keyCode).toLowerCase();

			if(!this._downKeys[character]) {
				var callbackName = character + 'down';
	
				if(typeof this._callbacks[callbackName] === 'function') {
					this._callbacks[callbackName].call(this._scope, e.shiftKey);
				}

				this._downKeys[character] = true;
			}
		},

		_onKeyUp: function kl_onKeyUp(e) {
			var character = String.fromCharCode(e.keyCode).toLowerCase();
			var callbackName = character + 'up';

			if(typeof this._callbacks[callbackName] === 'function') {
				this._callbacks[callbackName].call(this._scope, e.shiftKey);
			}

			this._downKeys[character] = false;
		},

		destroy: function() {
			this._hook.removeEventListener("keypress", this._keyPressListener, false);
			this._hook.removeEventListener("keydown", this._keyDownListener, false);
			this._hook.removeEventListener("keyup", this._keyUpListener, false);
		}
	};
})();


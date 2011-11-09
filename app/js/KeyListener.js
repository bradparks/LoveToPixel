(function() {
	var _specialKeys = {
		'16' : 'shift',
		'17' : 'control',
		'18' : 'alt',
		'32' : 'space',
		'91' : 'command',
		'27' : 'esc'
	};

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
		_getCharacter: function(keyCode) {
			return _specialKeys[keyCode] || String.fromCharCode(keyCode).toLowerCase();
		},
		_onKeyPress: function kl_onKeyPress(e) {
			var character =  this._getCharacter(e.keyCode || e.charCode); 
			character = character.toLowerCase();

			if(character === 'space') {
				e.preventDefault();
			}
		
			if(typeof this._callbacks[character] === 'function') {
				this._callbacks[character].call(this._scope, e.shiftKey);
			}

			return character !== 'space';
		},

		_onKeyDown: function kl_onKeyDown(e) {
			var character =  this._getCharacter(e.keyCode); 

			if(character === 'space') {
				e.preventDefault();
			}

			if(!this._downKeys[character]) {
				var callbackName = character + 'down';
	
				if(typeof this._callbacks[callbackName] === 'function') {
					this._callbacks[callbackName].call(this._scope, e.shiftKey);
				}

				this._downKeys[character] = true;
			}

			return character !== 'space';
		},

		_onKeyUp: function kl_onKeyUp(e) {
			var character =  this._getCharacter(e.keyCode); 
			var callbackName = character + 'up';

			if(character === 'space') {
				e.preventDefault();
			}

			if(typeof this._callbacks[callbackName] === 'function') {
				this._callbacks[callbackName].call(this._scope, e.shiftKey);
			}

			this._downKeys[character] = false;

			return character !== 'space' ;
		},

		destroy: function() {
			this._hook.removeEventListener("keypress", this._keyPressListener, false);
			this._hook.removeEventListener("keydown", this._keyDownListener, false);
			this._hook.removeEventListener("keyup", this._keyUpListener, false);
		}
	};
})();


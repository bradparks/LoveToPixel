// TODO: want to not handle key events in input fields (editing layer names)
// the current solution is pretty lame (instanceof HTMLInputElement)
(function() {
	var _specialKeys = {
		'16' : 'shift',
		'17' : 'control',
		'18' : 'alt',
		'32' : 'space',
		'91' : 'command',
		'27' : 'esc'
	};

	var _numbersWhenShifted = {
		'!' : 1,
		'@' : 2,
		'#' : 3,
		'$' : 4,
		'%' : 5,
		'^' : 6,
		'&' : 7,
		'*' : 8,
		'(' : 9,
		')' : 0
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
		_onKeyPress: function(e) {
			if(e.target instanceof HTMLInputElement) {
				return;
			}

			var character =  this._getCharacter(e.keyCode || e.charCode); 
			character = character.toLowerCase();

			if(character === 'space') {
				e.preventDefault();
			}
		
			if(typeof this._callbacks[character] === 'object') {
				this._callbacks[character].fn.call(this._scope, e.shiftKey);
			} else if(_numbersWhenShifted[character] && typeof this._callbacks[_numbersWhenShifted[character].toString()] === 'object') {
				this._callbacks[_numbersWhenShifted[character].toString()].fn.call(this._scope, true);
			}

			return character !== 'space';
		},

		_onKeyDown: function(e) {
			if(e.target instanceof HTMLInputElement) {
				return;
			}

			var character =  this._getCharacter(e.keyCode); 

			if(character === 'space') {
				e.preventDefault();
			}

			if(!this._downKeys[character]) {
				var callbackName = character + 'down';
	
				if(typeof this._callbacks[callbackName] === 'object') {
					this._callbacks[callbackName].fn.call(this._scope, e.shiftKey);
				}

				this._downKeys[character] = true;
			}

			return character !== 'space';
		},

		_onKeyUp: function(e) {
			if(e.target instanceof HTMLInputElement) {
				return;
			}

			var character =  this._getCharacter(e.keyCode); 
			var callbackName = character + 'up';

			if(character === 'space') {
				e.preventDefault();
			}

			if(typeof this._callbacks[callbackName] === 'object') {
				this._callbacks[callbackName].fn.call(this._scope, e.shiftKey);
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


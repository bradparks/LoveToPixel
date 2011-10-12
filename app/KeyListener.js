(function() {
	LTP.KeyListener = function KeyListener(config) {
		var me = this;
		if(!config) {
			throw new Error("KeyListener: must be constructed with a config object");
		}
		this._scope = config.scope || this;
		this._hook = config.hook || window;
		this._callbacks = config.callbacks || {};
	
		this._hook.addEventListener("keypress", LTP.util.bind(this._onKeyDown, this), false);
	};

	LTP.KeyListener.prototype._onKeyDown = function kl_onKeyDown(e) {
		var character = String.fromCharCode(e.charCode);
		character = character.toLowerCase();
	
		if(typeof this._callbacks[character] === 'function') {
			this._callbacks[character].call(this._scope, e.shiftKey);
		}
	} 
})();


(function() {
	var _mouseX, _mouseY;
	function onMouseMove(e) {
		_mouseX = e.browserEvent.x;
		_mouseY = e.browserEvent.y;
	}

	Ext.define('LTP.FloatingPalette', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.floatingpalette',
		width: 200,
		height: 50,
		autoRender: true,
		floating: true,
		layout: 'column',
		isPopped: false,

		togglePopup: function() {
			if(!this.isPopped) {
				this.showAt(_mouseX - this.width / 2, _mouseY - this.height - 30);
			} else {
				this.hide();
			}
			this.isPopped = !this.isPopped;
		}
	},
	function() {
		Ext.getDoc().on('mousemove', onMouseMove);
	});
})();

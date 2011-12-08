(function() {
	var _mouseX, _mouseY;
	function onMouseMove(e) {
		_mouseX = e.getX();
		_mouseY = e.getY();
	}

	Ext.define('LTP.FloatingPalette', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.floatingpalette',
		width: 200,
		autoRender: true,
		floating: true,
		layout: 'column',
		isPopped: false,

		constructor: function(config) {
			this.callParent(arguments);
			this.messageBus = config.messageBus || LTP.GlobalMessageBus;
		},

		togglePopup: function() {
			if(!this.isPopped) {
				this.showAt(_mouseX - this.width / 2, _mouseY);
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

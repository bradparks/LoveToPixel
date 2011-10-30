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

		defaults: {
			xtype: 'ltp.swatch'
		},

		initComponent: function() {
			var colors = this.colors || [];
			var items = [];

			for(var i = 0; i < colors.length; ++i) {
				items.push({
					color: colors[i],
					listeners: {
						click: function() {
							this.up('panel').hide();
						}
					}
				});
			}

			this.items = items;
			this.callParent(arguments);
		},

		popup: function() {
			this.showAt(_mouseX - this.width / 2, _mouseY - this.height - 30);
		}
	},
	function() {
		Ext.getDoc().on('mousemove', onMouseMove);
	});
})();

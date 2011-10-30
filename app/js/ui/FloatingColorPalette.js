(function() {
	Ext.define('LTP.FloatingColorPalette', {
		extend: 'LTP.FloatingPalette',
		alias: 'widget.ltp.floatingcolorpalette',

		defaults: {
			xtype: 'ltp.colorswatch'
		},

		initComponent: function() {
			var colors = this.colors || [];
			var items = [];

			for(var i = 0; i < colors.length; ++i) {
				items.push({
					color: colors[i],
					listeners: {
						click: function() {
							var panel = this.up('panel');
							panel.hide();
							panel.isPopped = false;
						}
					}
				});
			}

			this.items = items;
			this.callParent(arguments);
		},
	});
})();


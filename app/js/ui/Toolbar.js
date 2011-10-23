(function() {
	Ext.define('LTP.Toolbar', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.toolbar',
		layout: 'column',
		height: 25,

		defaults: {
			xtype: 'ltp.swatch',
		},

		constructor: function(config) {
			this.callParent(arguments);
		},
		initComponent: function() {
			var colors = this.colors || [];
			var items = [];

			for(var i = 0; i < colors.length; ++i) {
				items.push({
					color: colors[i]
				});
			}

			this.items = items;
			this.callParent(arguments);
		}
	});
})();


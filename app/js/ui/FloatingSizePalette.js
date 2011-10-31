(function() {
	Ext.define('LTP.FloatingSizePalette', {
		extend: 'LTP.FloatingPalette',
		alias: 'widget.ltp.floatingsizepalette',
		width: 144,
		height: 26,

		defaults: {
			xtype: 'ltp.sizeswatch'
		},

		initComponent: function() {
			var sizes = this.sizes || [];
			var items = [];

			for(var i = 0; i < sizes.length; ++i) {
				items.push({
					size: sizes[i],
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



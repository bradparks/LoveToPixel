(function() {
	Ext.define('LTP.CurrentColor', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.currentcolor',
		layout: 'vbox',
		width: 50,
		height: 20,
		items: [
			{
				xtype: 'panel',
				width: 50,
				height: 20,
				itemId: 'swatch'
			}
		],

		constructor: function(config) {
			this.callParent(arguments);

			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe(config.tool + 'ColorChange', function(color) {
				this.down('#swatch').body.setStyle('backgroundColor', color);
			}, this);
		}
	});
})();

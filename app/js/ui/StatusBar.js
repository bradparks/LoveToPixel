(function() {
	Ext.define('LTP.StatusBar', {
		extend: 'Ext.panel.Panel',
		layout: 'hbox',
		alias: 'widget.ltp.statusbar',
		items: [
			{
				xtype: 'ltp.currentcolor',
				tool: 'left'
			},
			{
				xtype: 'ltp.currentcolor',
				tool: 'right'
			}
		]
	});
})();

(function() {
	Ext.define('LTP.StatusBar', {
		extend: 'Ext.container.Container',
		layout: 'hbox',
		alias: 'widget.ltp.statusbar',
		items: [
			{
				xtype: 'ltp.flairmessage'
			},
			{
				xtype: 'ltp.currentcolor',
				tool: 'left'
			},
			{
				xtype: 'ltp.currentcolor',
				tool: 'right'
			},
			{
				xtype: 'ltp.currentzoom',
				style: {
					marginLeft: '30px'
				}
			},
			{
				xtype: 'ltp.currentcoordinates'
			},
			{
				xtype: 'ltp.currentlock'
			}
		]
	});
})();

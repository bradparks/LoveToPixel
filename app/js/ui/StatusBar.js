(function() {
	Ext.define('LTP.StatusBar', {
		extend: 'Ext.container.Container',
		layout: 'hbox',
		alias: 'widget.ltp.statusbar',
		items: [
			{
				xtype: 'ltp.flairmessage',
				style: {
					paddingLeft: '10px'
				}
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
			},
			{
				xtype: 'ltp.helplink',
				linkText: 'key commands',
				style: {
					marginLeft: '80px'
				},
				listeners: {
					helprequested: function() {
						Ext.create('LTP.HelpWindow', { commands: LTP.app.callbacks }).show();
					}
				}
			},
			{
				xtype: 'container',
				style: {
					marginLeft: '30px'
				},
				html: '<a href="https://github.com/city41/LoveToPixel/issues/new" target="_blank">Found a bug?</a>'
			}
		]
	});
})();

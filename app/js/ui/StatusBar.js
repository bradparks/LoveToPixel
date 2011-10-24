(function() {
	Ext.define('LTP.StatusBar', {
		extend: 'Ext.container.Container',
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
			},
			{
				xtype: 'ltp.currentzoom',
			},
			{
				xtype: 'ltp.currentcoordinates'
			},
			{
				xtype: 'container',
				html: '<b>LoveToPixel: extremely early code, not at all done or ready, stay tuned! </b>' + 
					'<a href="mailto:matt.e.greer@gmail.com?subject=LTP">matt.e.greer@gmail.com</a>, ' +
					'<a href="https://github.com/city41/LoveToPixel" target="_blank">github</a>, ' +
					'<a href="https://github.com/city41/LoveToPixel/blob/master/README.md" target="_blank">README</a>'
			}
		]
	});
})();

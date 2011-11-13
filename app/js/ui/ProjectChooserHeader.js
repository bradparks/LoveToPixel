(function() {
	Ext.define('LTP.ProjectChooserHeader', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.projectchooserheader',
		layout: 'anchor',
		border: false,

		defaults: {
			border: false
		},

		items: [
			{
				html: 'header goes here'
			},
			{
				xtype: 'ltp.browserwarningpanel'
			}
		]
	});
})();


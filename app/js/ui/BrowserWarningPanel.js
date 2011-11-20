(function() {
	Ext.define('LTP.BrowserWarningPanel', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.browserwarningpanel',
		title: 'Browser Compatibility Warning!',
		border: true,
		margin: 30,
		iconCls: 'warningIcon',
		cls: 'warningPanel',

		constructor: function() {
			this.callParent(arguments);
		},

		initComponent: function() {

			var info = LTP.compatibilityInfo();
			var items = [];

			if(!info.success) {
				items.push({
					xtype: 'panel',
					border: false,
					style: {
						marginTop: '10px',
						marginBottom: '10px'
					},
					html: "<b>LoveToPixel uses some cutting edge browser features. Unfortunately your browser didn't quite make the cut. We recommend using Chrome (if on OSX) or Firefox 8 (on any platform) for the optimal experience</b>"
				});

				for(var prop in info) {
					if(info.hasOwnProperty(prop) && !info[prop].available && info[prop].message) {
						items.push({
							xtype: 'panel',
							border: false,
							html: Ext.String.format("<b>{0}:</b> {1}", prop, info[prop].message)
						});
					}
				}
				items.push({
					xtype: 'panel',
					border: false,
					margin: 10,
					html: Ext.String.format("<b>{0}</b>", info.resolution)
				});
			}

			this.items = items;
			this.callParent(arguments);
			this.setVisible(!info.success);
		}
	});

})();


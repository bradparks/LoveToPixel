(function() {
	Ext.define('LTP.BrowserWarningPanel', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.browserwarningpanel',
		border: false,
		iconCls: 'warningIcon',
		style: {
			borderBottom: '4px solid black'
		},

		constructor: function() {
			this.callParent(arguments);
		},

		initComponent: function() {

			var info = LTP.compatibilityInfo();
			var items = [];

			if (!info.success) {
				items.push({
					xtype: 'container',
					margin: 0,
					html: '<img src="images/browserWarning.png" alt="browser warning" />',
					height: 63,
					style: {
						borderBottom: '4px solid black',
						backgroundColor: 'orange'
					}
				},
				{
					xtype: 'container',
					border: false,
					margin: 15,
					html: "So far only Chrome (on OSX) or Firefox 8 (on all platforms) are fully supported. " +
					"Your browser is not supported because: <b>" + info.conclusion + "</b>"
				});
			}

			this.items = items;
			this.callParent(arguments);
			this.setVisible(!info.success);
		}
	});

})();


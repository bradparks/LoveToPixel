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

			var missingFeatures = [];
			for (var prop in info) {
				if (info.hasOwnProperty(prop) && ! info[prop].available && info[prop].message) {
					missingFeatures.push(prop);
				}
			}

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
					html: "love to pixel only works on cutting edge browsers. So far that is Chrome (on OSX) or Firefox 8 (on all platforms). " +
					"Your browser is missing these features or its support for them is buggy:<b> " + missingFeatures.join(', ') + "</b>"
				});
			}

			this.items = items;
			this.callParent(arguments);
			this.setVisible(!info.success);
		}
	});

})();


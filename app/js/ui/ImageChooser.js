(function() {
	function parseSizeString(sizeString) {
		var parts = sizeString.split('x');
		return s(parseInt(parts[0], 10), parseInt(parts[1], 10));
	}

	Ext.define('LTP.ImageChooser', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.imagechooser',

		width: 300,
		items: {
			xtype: 'textfield',
			fieldLabel: 'size',
			value: '600x400',
			name: 'size',
			itemId: 'size',
			tabIndex: 0,
			enableKeyEvents: true,
			listeners: {
				keydown: function(text, e) {
					if(e.keyCode === Ext.EventObject.ENTER) {
						var parent = this.up('panel');
						var sizeString = this.getValue();
						var size = parseSizeString(sizeString); 

						parent.fireEvent('newImage', size);
						parent.close();
					}
				}
			}
		},

		initComponent: function() {
			this.callParent(arguments);
			this.on('show', function() {
				this.focus(true);
			}, this);
		}
	});
})();

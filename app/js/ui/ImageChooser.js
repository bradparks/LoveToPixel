(function() {
	function parseSizeString(sizeString) {
		if(!sizeString) {
			return sizeString;
		}

		var parts = sizeString.split('x');
		return s(parseInt(parts[0], 10), parseInt(parts[1], 10));
	}

	Ext.define('LTP.ImageChooser', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.imagechooser',
		width: 400,
		layout: 'anchor',

		defaults: {
			margin: 2
		},
		items: [{
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
						parent.go();
					}
				}
			}
		},
		{
			xtype: 'filefield',
			fieldLabel: 'or existing image'
		},
		{
			xtype: 'button',
			text: 'Start',
			handler: function() {
				var parent = this.up('panel');
				parent.go();
			}
		}],

		initComponent: function() {
			this.callParent(arguments);
			this.on('show', function() {
				this.focus(true);
			}, this);
		},

		go: function() {
			var sizeString = this.down('textfield').getValue();
			var size = parseSizeString(sizeString); 
			var fileList = this.down('filefield').fileInputEl.dom.files;

			this.fireEvent('newImage', {
				imageSize: size,
				imageFile: fileList && fileList[0]
			});

			this.close();
		}
	});
})();

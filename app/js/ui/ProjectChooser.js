(function() {
	function parseSizeString(sizeString) {
		if (!sizeString) {
			return sizeString;
		}

		var parts = sizeString.split('x');
		return s(parseInt(parts[0], 10), parseInt(parts[1], 10));
	}

	Ext.define('LTP.ProjectChooser', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.projectchooser',
		width: '100%',
		height: '100%',
		layout: 'border',
		border: false,

		defaults: {
			border: false
		},

		initComponent: function() {
			this.items = [{
				region: 'north',
				html: 'this will be the header'
			},
			{
				region: 'center',
				xtype: 'panel',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				defaults: {
					margin: 20,
					flex: 1,
					autoScroll: true
				},
				items: [{
					xtype: 'ltp.projectlist',
					title: 'Saved Projects',
					projects: this.projects
				},
				{
					xtype: 'panel',
					title: 'From an Image',
					items: [{
						xtype: 'filefield',
						fieldLabel: 'Image'
					}]
				},
				{
					xtype: 'panel',
					title: 'New Project',
					items: [{
						xtype: 'textfield',
						fieldLabel: 'size',
						value: '600x400',
						name: 'size',
						itemId: 'sizeField',
						tabIndex: 0,
						enableKeyEvents: true,
						listeners: {
							keydown: function(text, e) {
								if (e.keyCode === Ext.EventObject.ENTER) {
									var parent = this.up('panel');
									parent.go();
								}
							}
						}
					}]
				}]
			},
			{
				region: 'south',
				xtype: 'button',
				text: 'Start',
				handler: function() {
					var parent = this.up('panel');
					parent.go();
				}
			}];

			this.callParent(arguments);
			//this.on('show', function() {
				//this.focus(true);
			//},
			//this);
		},

		go: function() {
			var sizeString = this.down('#sizeField').getValue();
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


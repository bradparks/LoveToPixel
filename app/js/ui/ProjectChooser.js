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
					itemId: 'projectList',
					title: 'Saved Projects',
					projects: this.projects,
					flex: 2
				},
				{
					xtype: 'panel',
					title: 'New Project',
					items: [{
						xtype: 'textfield',
						fieldLabel: 'Name',
						name: 'name',
						itemId: 'nameField'
					},
					{
						xtype: 'filefield',
						fieldLabel: 'Image'
					},
					{
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
		},

		_getSizeFromSizeField: function() {
			var sizeString = this.down('#sizeField').getValue();
			return parseSizeString(sizeString);
		},

		_getNameFromNameField: function() {
			var name = this.down('#nameField').getValue();
			return name || 'Untitled Project';
		},

		_setSizeAndImageDataFromFile: function(file, project, callback) {
			LTP.ImageLoader.load(file, function(loadedImg) {
				project.size = s(loadedImg.width, loadedImg.height);
				project.layers[0].data = loadedImg.src;
				callback();
			});
		},

		go: function() {
			function fireEvent(project) {
				this.fireEvent('projectChosen', project);
				this.close();
			}

			var project = this.down('#projectList').getSelectedProject();

			if (!project) {
				project = {};

				project.name = this._getNameFromNameField();

				project.layers = [{
					layerName: 'Initial Layer',
					isVisible: true,
					index: 3,
					data: null
				}];

				var fileList = this.down('filefield').fileInputEl.dom.files;

				if (fileList && fileList[0]) {
					var me = this;
					this._setSizeAndImageDataFromFile(fileList[0], project, function() {
						fireEvent.call(me, project);
					});
					return;
				} else {
					project.size = this._getSizeFromSizeField() || s(300, 300);
				}
			}
			fireEvent.call(this, project);
		}
	});
})();


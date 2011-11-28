(function() {
	var _introHtml = "love to pixel is a web based pixel editor. That's a fancy name for a paint program " +
		"geared towards those who do \"old school\" pixel art (think 16 bit video games)" + 
		"<ul>" + 
		"<li><a href='#'>read the quick help</a> or <a href='#'>watch the screencast</a> to get started</li>" + 
		"<li>or <a href='#'>start a new project</a></li>" + 
		"<li>or resume a saved project below</li></ul>";
	

	function parseSizeString(sizeString) {
		if (!sizeString) {
			return sizeString;
		}

		var parts = sizeString.split('x');
		return s(parseInt(parts[0], 10), parseInt(parts[1], 10));
	}

	Ext.define('LTP.ProjectChooser', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.projectchooser',
		layout: 'fit',
		border: false,
		width: '100%',
		height: '100%',
		itemId: 'projectChooser',
		baseCls: 'projectChooserContainer',

		defaults: {
			border: false
		},

		initComponent: function() {
			Ext.EventManager.onWindowResize(this._onWindowResize, this);

			this.items = {
				xtype: 'panel',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				baseCls: 'projectChooser',

				defaults: {
					autoScroll: false,
					border: false
				},
				items: [{
					xtype: 'container',
					margin: 0,
					html: '<img src="images/mainLogo.png" alt="main logo" />',
					height: 107,
					style: {
						borderBottom: '4px solid black',
					}
				},
				{
					xtype: 'container',
					items: {
						xtype: 'container',
						baseCls: 'introSection',
						margin: 15,
						html: _introHtml,
					},
					style: {
						borderBottom: '4px solid black',
						backgroundColor: 'white'
					}
				},
				{
					xtype: 'ltp.browserwarningpanel'
				},
				{
					xtype: 'container',
					margin: 0,
					html: '<img src="images/savedProjects.png" alt="saved projects header" />',
					height: 63,
					style: {
						borderBottom: '4px solid black',
						backgroundColor: '#9E0000'
					}
				},
				{
					xtype: 'ltp.projectlist',
					itemId: 'projectList',
					projects: this.projects,
					flex: 1,
					autoScroll: true,
					listeners: {
						itemdblclick: function() {
							this._go();
						},
						scope: this
					}
				},
				{
					xtype: 'container',
					margin: 0,
					items: {
						xtype: 'container',
						margin: 10,
						baseCls: 'doubleClickLine',
						html: 'double click a project to edit it',
					},
					style: {
						backgroundColor: 'white'
					}
				}]
			};

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

		_onWindowResize: function(width, height) {
			this.setSize(width, height);
		},

		_go: function() {
			function fireEvent(project) {
				this.fireEvent('projectChosen', project);
				this.destroy();
			}

			var project = this.down('#projectList').getSelectedProject();

			if (!project) {
				project = {};

				project.name = this._getNameFromNameField();

				project.layers = [{
					id: 1,
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


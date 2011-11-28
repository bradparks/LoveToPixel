(function() {
	var _introHtml = "love to pixel is a web based pixel editor. That's a fancy name for a paint program " + "geared towards those who do \"old school\" pixel art (think 16 bit video games)" + "<ul>" + "<li><a href='https://github.com/city41/LoveToPixel/blob/master/help/QuickHelp.md' target='_blank' " + "id='launchHelpLink'>read the quick help</a> to get started</li></ul>";

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
						html: _introHtml
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
					html: 'new project',
					style: {
						borderBottom: '4px solid black',
						backgroundColor: '#9E0000'
					}
				},
				{
					xtype: 'panel',
					layout: 'hbox',
					defaults: {
						margin: 5
					},
					style: {
						borderBottom: '4px solid black',
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: 'Name',
						labelWidth: 40,
						name: 'name',
						itemId: 'nameField'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Size',
						labelWidth: 40,
						value: '600x400',
						name: 'size',
						itemId: 'sizeField',
						tabIndex: 0,
						enableKeyEvents: true,
						listeners: {
							keydown: function(text, e) {
								if (e.keyCode === Ext.EventObject.ENTER) {
									var parent = this.up('#projectChooser');
									parent._go();
								}
							}
						}
					},
					{
						xtype: 'button',
						text: 'Start',
						handler: function() {
							var parent = this.up('#projectChooser');
							parent._go();
						}
					}]
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

		_onHelpClick: function() {
			Ext.MessageBox.alert('help', 'help here');
		},

		_onScreencastClick: function() {
			Ext.MessageBox.alert('Screencast', 'The screencast won\'t be made until LTP reaches 1.0');
		},

		_onStartNewProjectClick: function() {
			Ext.MessageBox.alert('new project', 'new here');
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

				project.size = this._getSizeFromSizeField() || s(300, 300);
			}
			fireEvent.call(this, project);
		}
	});
})();


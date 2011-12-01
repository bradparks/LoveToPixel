(function() {
	var _localStorageSizeKey = '__ltp_projectchooser_size__';

	var _introHtml = "love to pixel is a web based pixel editor. That's a fancy name for a paint program " + "geared towards those who do \"old school\" pixel art (think 16 bit video games). <a href='https://github.com/city41/LoveToPixel/blob/master/help/QuickHelp.md' target='_blank' " + "id='launchHelpLink'>Read the quick help</a> to get started";

	function parseSizeString(sizeString) {
		if (!sizeString) {
			return sizeString;
		}

		var parts = sizeString.split('x');

		if (!parts || parts.length !== 2) {
			return;
		}

		var width = parseInt(parts[0], 10);
		var height = parseInt(parts[1], 10);

		if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
			return;
		}

		return s(width, height);
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
						borderBottom: '4px solid black'
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
					html: '<img src="images/newProject.png" alt="new project header" />',
					height: 63,
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
						itemId: 'nameField',
						enableKeyEvents: true,
						listeners: {
							keydown: function(text, e) {
								if (e.keyCode === Ext.EventObject.ENTER) {
									var parent = this.up('#projectChooser');
									parent._startNewProject();
								}
							}
						}
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Size',
						labelWidth: 40,
						value: this._getInitialSizeValue(),
						name: 'size',
						itemId: 'sizeField',
						invalidText: "needs to be in the form '100x100'",
						enableKeyEvents: true,
						listeners: {
							keydown: function(text, e) {
								if (e.keyCode === Ext.EventObject.ENTER) {
									var parent = this.up('#projectChooser');
									parent._startNewProject();
								}
							}
						},
						validate: function() {
							var isValid = !! parseSizeString(this.value);
							if (!isValid) {
								this.markInvalid("needs to be in the form '100x100'");
							} else {
								this.clearInvalid();
							}

							return isValid;
						}
					},
					{
						xtype: 'button',
						text: 'Start',
						handler: function() {
							var parent = this.up('#projectChooser');
							parent._startNewProject();
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
						itemdblclick: function(grid, record, tr) {
							this._startExistingProject(record.data);
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
				},
				{
					xtype: 'container',
					margin: 0,
					style: {
						textAlign: 'right',
						backgroundColor: 'black',
						color: 'white',
						fontSize: '.9em',
						fontStyle: 'italic',
						padding: '2px'
					},
					html: Ext.String.format('version {0}, <a href="http://github.com/city41/LoveToPixel" target="_blank">github</a>', LTP.version)
				}]
			};

			this.callParent(arguments);
		},

		_getInitialSizeValue: function() {
			return localStorage[_localStorageSizeKey] || '600x400';
		},

		_getSizeFromSizeField: function() {
			var sizeField = this.down('#sizeField');

			var sizeString = sizeField.getValue();

			var size = parseSizeString(sizeString);

			if (size) {
				localStorage[_localStorageSizeKey] = sizeString;
			}

			return size;
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

		_startNewProject: function() {
			var size = this._getSizeFromSizeField();

			if (!size) {
				// the size field will have a validation error at this point
				return;
			}

			var project = {
				name: this._getNameFromNameField(),
				layers: [{
					id: 1,
					layerName: 'Initial Layer',
					isVisible: true,
					index: 3,
					data: null
				}],
				isDirty: true,
				size: size
			};

			this._go(project);
		},

		_startExistingProject: function(project) {
			this._go(project);
		},

		_go: function(project) {
			this.fireEvent('projectChosen', project);
			this.destroy();
		}
	});
})();


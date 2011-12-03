(function() {
	var _paintingHelp = "LTP allows painting with both the left and right mouse button. The status bar shows the current color " +
		"for each one. When selecting a color in the color palette, the button you use determines which tool gets set to your selection";

	Ext.define('LTP.HelpWindow', {
		extend: 'Ext.window.Window',
		alias: 'widget.ltp.helpwindow',
		title: 'Help',
		width: 600,

		constructor: function(config) {
			this.callParent(arguments);
			Ext.apply(this, config);
		},

		buttons: [{
			text: 'OK',
			handler: function() {
				this.up('window').close();
			}
		}],

		initComponent: function() {
			var items = [];

			items.push(this._createHelpEntry('Painting', _paintingHelp));
			//items.push(this._createHelpEntry('Layers', _layerHelp));
			items.push(this._createKeyCommandHelp());

			this.items = items;
			this.callParent(arguments);
		},

		_createKeyCommandHelp: function() {
			var items = [];
			for(var prop in this.commands) {
				if(this.commands.hasOwnProperty(prop) && this.commands[prop].fn && this.commands[prop].noHelp !== true) {
					var command = this.commands[prop];
					var commandEntry = this._createCommandEntry(command.label || prop, command.message);
					items.push(commandEntry);
					if(command.shiftMessage) {
						var shiftCommandEntry = this._createCommandEntry(command.label || prop, command.shiftMessage, true);
						items.push(shiftCommandEntry);
					}
				}
			}

			return {
				xtype: 'panel',
				title: 'Key Commands',
				items: items
			};
		},

		_createHelpEntry: function(title, text) {
			return {
				xtype: 'panel',
				title: title,
				items: {
					xtype: 'container',
					html: text,
					margin: 5
				}
			};
		},

		_createCommandEntry: function(label, message, isShift) {
			return {
				xtype: 'panel',
				border: false,
				layout: 'hbox',
				defaults: {
					border: false
				},
				items: [{
					width: 100,
					style: {
						textAlign: 'right',
						marginRight: '10px'
					},
					html: Ext.String.format('<b>{0}{1}</b>: ', isShift ? '&lt;shift&gt; ' : '', label)
				},
				{
					html: message
				}]
			};
		}
	});
})();


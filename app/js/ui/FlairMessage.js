(function() {
	Ext.define('LTP.FlairMessage', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.flairmessage',
		width: 200,
		items: {
			xtype: 'label',
			text: "Let's pixel!"
		},

		constructor: function(config) {
			this.callParent(arguments);

			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe('flairMessage', function(message) {
				if (message) {
					this.el.highlight(colors.orange, { duration: 2000 });
					this.down('label').setText(message);
					Ext.defer(function() {
						this._resetMessage();
					},
					2000, this);
				} else {
					this._resetMessage();
				}
			},
			this);
		},

		_resetMessage: function() {
			this.down('label').setText("Let's pixel!");
		}
	});

})();


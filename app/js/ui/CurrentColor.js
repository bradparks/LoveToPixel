(function() {
	Ext.define('LTP.CurrentColor', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.currentcolor',
		width: 40,
		height: 16,
		style: {
			margin: '2px',
			border: '1px solid black'
		},

		constructor: function(config) {
			this.callParent(arguments);

			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe(config.tool + 'ColorSelected', function(color) {
				if(color) {
					this.el.setStyle('backgroundColor', color);
				}
			}, this);
		}
	});
})();


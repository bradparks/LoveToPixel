(function() {
	Ext.define('LTP.CurrentColor', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.currentcolor',
		width: 50,
		height: 20,

		constructor: function(config) {
			this.callParent(arguments);

			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe(config.tool + 'ToolChanged', function(tool) {
				if(tool.color) {
					this.el.setStyle('backgroundColor', tool.color);
				}
			}, this);
		}
	});
})();


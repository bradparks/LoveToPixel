(function() {
	Ext.define('LTP.CurrentZoom', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.currentzoom',
		width: 100,
		items: {
			xtype: 'label',
			text: 'zoom: 100%',
		},

		constructor: function(config) {
			this.callParent(arguments);
	
			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe('zoomChanged', function(newZoom) {
				this.down('label').setText('zoom: ' + (newZoom * 100).toString() + '%');
			}, this);
		}
	});

})();

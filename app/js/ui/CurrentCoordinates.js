(function() {
	Ext.define('LTP.CurrentCoordinates', {
		extend: 'Ext.panel.Panel',
		alias: 'widget.ltp.currentcoordinates',
		width: 100,
		items: {
			xtype: 'label',
			text: 'x: out y: out'
		},

		constructor: function(config) {
			this.callParent(arguments);
	
			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe('canvasMouseCoordinatesChanged', function(point) {
				if(point) {
					this.down('label').setText('x: ' + point.x + ', y: ' + point.y);
				} else {
					this.down('label').setText('x: out, y: out');
				}
			}, this);
		}
	});

})();


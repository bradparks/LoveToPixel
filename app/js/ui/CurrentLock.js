(function() {
	Ext.define('LTP.CurrentLock', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.currentlock',
		width: 100,
		items: {
			xtype: 'label',
			text: 'lock: none'
		},

		constructor: function(config) {
			this.callParent(arguments);
	
			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe('lockChanged', function(lockType) {
				if(lockType) {
					this.down('label').setText('lock: ' + lockType);
				} else {
					this.down('label').setText('lock: none');
				}
			}, this);
		}
	});

})();



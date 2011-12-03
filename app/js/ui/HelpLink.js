(function() {
	Ext.define('LTP.HelpLink', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.helplink',
		html: '<a href="#" id="_helpLink">help</a>',

		initComponent: function() {
			this.callParent(arguments);
			this.addEvents('helprequested');

			this.on('afterrender', function() {
				Ext.fly('_helpLink').on('click', this._onHelpLinkClick, this);
			}, this);
		},

		_onHelpLinkClick: function(e) {
			e.preventDefault();
			e.stopPropagation();

			this.fireEvent('helprequested');

			return false;
		}
	});
})();


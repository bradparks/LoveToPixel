(function() {
	Ext.define('LTP.HelpLink', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.helplink',

		constructor: function(config) {
			this.callParent(arguments);
			this.html = Ext.String.format('<a href="#" id="_helpLink">{0}</a>', config.linkText || 'help');
		},

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


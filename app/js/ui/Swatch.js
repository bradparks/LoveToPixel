(function() {
	Ext.define('LTP.Swatch', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.swatch',
		width: 20,
		height: 20,
		margin: 1,

		constructor: function(config) {
			this.callParent(arguments);
			this.addEvents('click');
			this.style = {
				backgroundColor: config.color,
				border: '1px solid black'
			};

			var me = this;
			this.on('render', function() {
				me.el.dom.addEventListener('mousedown', function(e) {
					var leftRight = e.button === 0 ? 'left' : 'right';

					LTP.GlobalMessageBus.publish(leftRight + 'ColorSelected', me.color);
					me.fireEvent('click');
				});

				me.el.dom.addEventListener('contextmenu', function(e) {
					e.preventDefault();
					e.stopPropagation();
					return false;
				});
			});
		}
	});

})();

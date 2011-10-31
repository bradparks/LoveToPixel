(function() {
	Ext.define('LTP.SizeSwatch', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.sizeswatch',
		width: 20,
		height: 20,

		constructor: function(config) {
			this.callParent(arguments);
			this.addEvents('click');
			this.style = {
				backgroundColor: colors.black,
				border: (10 - this.size) + 'px solid white'
			};

			var me = this;
			this.on('render', function() {
				me.el.dom.addEventListener('mousedown', function(e) {
					var leftRight = e.button === 0 ? 'left' : 'right';

					//LTP.GlobalMessageBus.publish(leftRight + 'ColorSelected', me.color);
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


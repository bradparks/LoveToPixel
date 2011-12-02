(function() {
	Ext.define('LTP.SizeSwatch', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.sizeswatch',
		width: 40,
		height: 40,
		baseCls: 'sizeSwatch',

		constructor: function(config) {
			this.callParent(arguments);
			this.addEvents('click');
			var size = this.size + 'px';
			var margin = (this.width/2) - (this.size/2) + 'px';

			this.html = Ext.String.format('<div style="width:{0};height:{0};margin:{1};background-color:black"></div>',
				size, margin);

			var me = this;
			this.on('render', function() {
				me.el.dom.addEventListener('mousedown', function(e) {
					var leftRight = e.button === 0 ? 'left' : 'right';

					LTP.GlobalMessageBus.publish(leftRight + 'SizeSelected', me.size);
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


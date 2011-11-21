(function() {
	Ext.define('LTP.ColorSwatch', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.colorswatch',
		width: 20,
		height: 20,
		margin: 1,

		constructor: function(config) {
			this.callParent(arguments);
			this.addEvents('click', 'dblclick');
			this.style = {
				backgroundColor: config.color,
				border: '1px solid black',
				color: colors.invert(config.color)
			};
			this.html = config.label;

			var me = this;
			this.on('render', function() {
				me.el.dom.addEventListener('mousedown', function(e) {
					me._mouseIsDown = true;
					setTimeout(function() {
						if (me._mouseIsDown) {
							me.fireEvent('longclick', e);
							me._mouseIsDown = false;
						}
					},
					200);
				});

				me.el.dom.addEventListener('mouseup', function(e) {
					if(me._mouseIsDown) {
						me.fireEvent('click', e);
					}

					me._mouseIsDown = false;
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


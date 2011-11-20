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
				border: '1px solid black'
			};

			var me = this;
			this.on('render', function() {
				me.el.dom.addEventListener('click', function(e) {
					console.log('in single click: ' + me._doubleClickOccured);
					if (me._doubleClickOccured) {
						console.log('returning early');
						delete me._doubleClickOccured;
						return;
					}

					setTimeout(function() {

						console.log('in setTimeout: ' + me._doubleClickOccured);
						if (!me._doubleClickOccured) {
							var leftRight = e.button === 0 ? 'left': 'right';

							LTP.GlobalMessageBus.publish(leftRight + 'ColorSelected', me.color);
							me.fireEvent('click');
						}
					},
					200);
				});

				me.el.dom.addEventListener('dblclick', function(e) {
					console.log('in dblclick');
					me._doubleClickOccured = true;
					me.fireEvent('dblclick');
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


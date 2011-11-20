(function() {
	function singleClick() {
		var panel = this.up('panel');
		panel.hide();
		panel.isPopped = false;
	}

	function doubleClick() {
		//alert('double click on: ' + this.color);
		this.el.dom.value = this.color;
		var jsc = new jscolor.color(this.el.dom);
		jsc.showPicker();
	}

	Ext.define('LTP.FloatingColorPalette', {
		extend: 'LTP.FloatingPalette',
		alias: 'widget.ltp.floatingcolorpalette',

		defaults: {
			xtype: 'ltp.colorswatch'
		},

		initComponent: function() {
			var items = [];

			for (var i = 0; i < this.colorManager.colors.length; ++i) {
				var swatch = {
					color: this.colorManager.colors[i],
					listeners: {
						click: singleClick,
						dblclick: doubleClick
					}
				};

				if(i < 9) {
					swatch.label = (i+1).toString()
				}

				items.push(swatch);
			}

			this.items = items;
			this.callParent(arguments);
		},
	});
})();


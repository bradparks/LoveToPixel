(function() {
	var picker;
	var currentSwatch;

	function singleClick() {
		if (picker) {
			if(currentSwatch) {
				currentSwatch.color = '#' + picker.toString().toUpperCase();
			}
			picker.hidePicker();
			picker = null;
			currentSwatch = null;
		} else {
			var panel = this.up('panel');
			panel.hide();
			panel.isPopped = false;
		}
	}

	function doubleClick() {
		currentSwatch = this;
		this.el.dom.value = this.color;
		picker = new jscolor.color(this.el.dom, {
			pickerClosable: true,
			pickerPosition: 'right',
			pickerZIndex: 40000
		});
		picker.showPicker();
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

				if (i < 9) {
					swatch.label = (i + 1).toString()
				}

				items.push(swatch);
			}

			this.items = items;
			this.callParent(arguments);
		},
	});
})();


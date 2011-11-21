(function() {
	var picker;
	var currentSwatch;

	function _singleClick(e) {
		var prefix = e.mouseButton ? 'right' : 'left';

		LTP.GlobalMessageBus.publish(prefix + 'ColorSelected', this.color);

		var panel = this.up('panel');
		panel.hide();
		panel.isPopped = false;
	}

	function _longClick() {
		currentSwatch = this;
		this.el.dom.value = this.color;
		picker = new jscolor.color(this.el.dom, {
			pickerClosable: true,
			pickerPosition: 'right',
			pickerZIndex: 40000
		});
		picker.showPicker();
	}

	function _onMouseDown(e) {
		if (e.target.id.indexOf('colorswatch') >= 0) {
			return;
		}
		if (picker && e.target) {
			if (!e.target.id || e.target.id.indexOf('jscolor.') === - 1) {
				if (currentSwatch) {
					currentSwatch.color = '#' + picker.toString().toUpperCase();
					var prefix = e.mouseButton ? 'right': 'left';
					LTP.GlobalMessageBus.publish(prefix + 'ColorSelected', currentSwatch.color);
					currentSwatch = null;
				}
				picker.hidePicker();
				picker = null;
				if (this.isPopped) {
					this.togglePopup();
				}
			}
		}
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
						click: _singleClick,
						longclick: _longClick
					}
				};

				if (i < 9) {
					swatch.label = (i + 1).toString()
				}

				items.push(swatch);
			}

			this.items = items;

			Ext.getBody().on('mousedown', _onMouseDown, this);
			this.callParent(arguments);
		},
	});
})();


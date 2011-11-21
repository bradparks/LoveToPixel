(function() {
	var _picker;
	var _currentSwatch;

	function _singleClick(e) {
		var prefix = e.button ? 'right' : 'left';

		LTP.GlobalMessageBus.publish(prefix + 'ColorSelected', this.color);

		var panel = this.up('panel');
		panel.hide();
		panel.isPopped = false;
	}

	function _longClick() {
		currentSwatch = this;
		this.el.dom.value = currentSwatch.color;
		_picker = new jscolor.color(currentSwatch.el.dom, {
			pickerClosable: true,
			pickerPosition: 'right',
			pickerZIndex: 40000
		});
		_picker.showPicker();
	}

	function _onMouseDown(e) {
		if (e.target.id.indexOf('colorswatch') >= 0) {
			return;
		}
		if (_picker && e.target) {
			if (!e.target.id || e.target.id.indexOf('jscolor.') === - 1) {
				if (currentSwatch) {
					currentSwatch.color = '#' + _picker.toString().toUpperCase();

					var palette = currentSwatch.up('panel');
					palette.colorManager.redefineAt(currentSwatch.index, currentSwatch.color);

					var prefix = e.button ? 'right': 'left';
					LTP.GlobalMessageBus.publish(prefix + 'ColorSelected', currentSwatch.color);
					currentSwatch = null;
				}
				_picker.hidePicker();
				_picker = null;
				if (this.isPopped) {
					this.togglePopup();
				}
			}
		}
	}

	Ext.define('LTP.FloatingColorPalette', {
		extend: 'LTP.FloatingPalette',
		alias: 'widget.ltp.floatingcolorpalette',

		//dockedItems: [{
			//xtype: 'toolbar',
			//dock: 'top',
			//items: [{
				//text: 'docked to the top'
			//}]
		//}],

		defaults: {
			xtype: 'ltp.colorswatch'
		},

		initComponent: function() {
			var items = [];
			var me = this;

			for (var i = 0; i < this.colorManager.colors.length; ++i) {
				var swatch = {
					color: this.colorManager.colors[i],
					index: i,
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

			//items.push({
				//xtype: 'ltp.addcolorswatch',
			//});

			this.items = items;

			Ext.getBody().on('mousedown', _onMouseDown, this);
			this.callParent(arguments);
		},
	});
})();


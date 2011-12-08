(function() {

	// TODO: all of this mouse handling stuff generally works, but it's messy
	// and hard to follow

	var _picker;
	var _currentSwatch;

	function _singleClick(e) {
		var prefix = e.button ? 'Right': 'Left';
		var panel = this.up('panel');

		panel.colorManager['set' + prefix + 'ColorTo'](this.index);
		panel.hide();
		panel.isPopped = false;

		if (_picker) {
			_picker.hidePicker();
			_picker = null;
		}
	}

	function disableContextMenu(element) {
		element.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
	}

	function _longClick() {
		_currentSwatch = this;
		this.el.dom.value = _currentSwatch.color;
		_picker = new jscolor.color(_currentSwatch.el.dom, {
			pickerClosable: false,
			pickerPosition: 'right',
			pickerZIndex: 40000
		});

		_picker.showPicker();
		disableContextMenu(document.getElementById('jscolor.boxB'));
	}

	function _onMouseDown(e) {
		if (e.target.id && e.target.id.indexOf('colorswatch') >= 0) {
			return;
		}
		if (_picker && e.target) {
			if (!e.target.id || e.target.id.indexOf('jscolor.') === - 1) {
				if (_currentSwatch) {
					_currentSwatch.color = '#' + _picker.toString().toUpperCase();

					var palette = _currentSwatch.up('panel');
					palette.colorManager.redefineAt(_currentSwatch.index, _currentSwatch.color);

					var prefix = e.button ? 'Right': 'Left';
					palette.colorManager['set' + prefix + 'ColorTo'](_currentSwatch.index);
					_currentSwatch = null;
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

		constructor: function(initialLeftColor, initialRightColor) {
			this.callParent(arguments);
			this.initialLeftColor = initialLeftColor;
			this.initialRightColor = initialRightColor;

			this.messageBus.subscribe('leftColorSelected', this._onLeftColorSelected, this);
			this.messageBus.subscribe('rightColorSelected', this._onRightColorSelected, this);

		},

		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			items: [{
				text: 'Add Color',
				handler: function() {
					var panel = this.up('panel');
					panel.addColor();
				}
			}]
		}],

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

			this.items = items;

			Ext.getBody().on('mousedown', _onMouseDown, this);
			this.callParent(arguments);
			this._onLeftColorSelected(this.initialLeftColor);
			this._onRightColorSelected(this.initialRightColor);
		},

		addColor: function() {
			this.add({
				color: colors.white,
				index: this.items.items.length,
				listeners: {
					click: _singleClick,
					longclick: _longClick
				}
			});

			this.colorManager.addColor(colors.white);
		},

		_onLeftColorSelected: function(color) {
			Ext.Array.each(this.items.items, function(item) {
				item.setIsCurrentLeft(item.color === color);
			});
		},

		_onRightColorSelected: function(color) {
			Ext.Array.each(this.items.items, function(item) {
				item.setIsCurrentRight(item.color === color);
			});
		}
	});
})();


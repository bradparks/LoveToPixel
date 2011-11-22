(function() {
	var _picker;
	var _currentSwatch;

	function _singleClick(e) {
		var prefix = e.button ? 'Right': 'Left';
		var panel = this.up('panel');

		panel.colorManager['set' + prefix + 'ColorTo'](this.index);
		panel.hide();
		panel.isPopped = false;
	}

	function disableContextMenu(element) {
		element.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
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
		disableContextMenu(document.getElementById('jscolor.boxB'));
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

		constructor: function() {
			this.callParent(arguments);
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

		_onLeftColorSelected: function(color, index) {
			console.log('index: ' + index);
			Ext.Array.each(this.items.items, function(item) {
				item.setIsCurrentLeft(item.index === index);
			});
		},

		_onRightColorSelected: function(color, index) {
			Ext.Array.each(this.items.items, function(item) {
				item.setIsCurrentRight(item.index === index);
			});
		}
	});
})();


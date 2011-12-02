(function() {

	function _hasDragDrop() {
		if(!!window.DataTransfer) {
			return "files" in DataTransfer.prototype;
		} else {
			var d = document.createElement('div');
			return d && typeof d.ondragover !== 'undefined' && d.ondrop !== 'undefined';
		}
	}
		

	Ext.define('LTP.DragDropZone', {
		extend: 'Ext.container.Container',
		alias: 'widget.ltp.dragdropzone',
		border: false,

		initComponent: function() {
			this.callParent(arguments);
			this.addEvents('filereceived');

			if(_hasDragDrop()) {
				this.on('afterrender', this._onRender, this);
				this.setVisible(true);
			} else {
				this.setVisible(false);
			}
		},

		_onRender: function() {
			this.el.on('dragover', this._onDragOver, this);
			this.el.on('dragleave', this._onDragLeave, this);
			this.el.on('drop', this._onDrop, this);
		},

		_onDragOver: function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.browserEvent.dataTransfer.dropEffect = 'copy';
			this.el.setStyle('background-color', '#EDE459');

			return false;
		},

		_onDragLeave: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.el.setStyle('background-color', colors.white);

			return false;
		},

		_onDrop: function(e) {
			if(e && e.browserEvent.dataTransfer && e.browserEvent.dataTransfer.files && e.browserEvent.dataTransfer.files.length) {
				e.preventDefault();
				e.stopPropagation();
				this.el.setStyle('background-color', colors.white);

				this.fireEvent('filereceived', e.browserEvent.dataTransfer.files[0]);
				
				return false;
			}
		}
	});
})();



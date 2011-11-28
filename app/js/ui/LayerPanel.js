(function() {
	Ext.define('LTP.LayerPanel', {
		extend: 'Ext.panel.Panel',
		layout: 'fit',
		itemId: 'layerPanel',
		border: false,

		constructor: function(config) {
			this.callParent(arguments);
			this._messageBus = config.messageBus || LTP.GlobalMessageBus;

			this._messageBus.subscribe('canvasContentChange', this._onCanvasContentChange, this);
			this._messageBus.subscribe('layerLoad', this._onCanvasContentChange, this);
		},

		initComponent: function() {
			var store = Ext.create('Ext.data.Store', {
				model: 'LTP.LayerModel'
			});

			this.viewStore = store;
			// this store should never persist
			this.viewStore.sync = function() {};
			var me = this;

			this.dockedItems = [{
				dock: 'top',
				xtype: 'toolbar',
				items: [{
					text: 'New Layer',
					listeners: {
						click: this._onNewClick,
						scope: this
					}
				},
				{
					text: 'New From Image'
				},
				{
					text: 'Flatten Image'
				}]
			}];

			this.items = [{
				xtype: 'grid',
				itemId: 'layerGrid',
				multiSelect: false,
				sortableColumns: false,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						dragText: 'Drag to re-arrange layer ordering'
					},
					listeners: {
						drop: function(node, data, overModel, dropPosition) {
							var suffix = dropPosition === 'before' ? 'Ahead': 'Behind';
							me.layerManager['moveLayer' + suffix](data.records[0].data, overModel.data);
						}
					}
				},
				store: store,
				minHeight: 100,
				columns: [{
					xtype: 'booleancolumn',
					trueText: '<img src="images/visible.png" />',
					falseText: ' ',
					header: '',
					dataIndex: 'isVisible',
					width: 42,
					field: {
						xtype: 'checkboxfield'
					},
					menuDisabled: true
				},
				{
					header: 'Name',
					dataIndex: 'layerName',
					flex: 1,
					field: {
						xtype: 'textfield'
					},
					menuDisabled: true
				},
				{
					xtype: 'templatecolumn',
					tpl: '<div style="height:{thumbnailHeight}px; width:{thumbnailWidth}px"><img class="thumbnail" src="{thumbnailData}" /></div>',
					flex: 1,
					dataIndex: 'thumbnailData'
				},
				{
					xtype: 'actioncolumn',
					header: 'Actions',
					width: 50,
					items: [{
						icon: '/images/delete.png',
						handler: function(grid, rowIndex, colIndex) {
							this.up('#layerPanel')._deleteOrMergeAt(rowIndex, 'delete');
						}
					},
					{
						icon: '/images/merge.png',
						handler: function(grid, rowIndex, colIndex) {
							this.up('#layerPanel')._deleteOrMergeAt(rowIndex, 'merge');
						}
					}]
				}],
				selType: 'rowmodel',
				plugins: [
				Ext.create('Ext.grid.plugin.RowEditing', {
					clicksToEdit: 2,
					listeners: {
						edit: function(editor, e) {
							editor.record.commit();
						}
					}
				})],
				listeners: {
					selectionchange: this._selectionChange,
					scope: this
				}
			}];

			this.disabled = true;
			this.callParent(arguments);
		},

		load: function(layerManager) {
			this.layerManager = layerManager;
			this._addLayersToStore(this.viewStore, layerManager);
			this.setDisabled(false);

			var grid = this.down('#layerGrid');
			grid.getSelectionModel().select(grid.store.first());
		},

		_selectionChange: function(selectionModel, selectedRecords, options) {
			if (selectedRecords && selectedRecords.length) {
				this.layerManager.setActiveLayerByLayer(selectedRecords[0].data);
			}
		},

		_onNewClick: function() {
			var newLayer = this.layerManager.addNewLayer();

			var layerModel = new Ext.create('LTP.LayerModel');
			layerModel.data = newLayer;

			this.viewStore.insert(0, [layerModel]);
		},

		_addLayersToStore: function(store, layerManager) {
			for (var i = 0; i < layerManager.layers.length; ++i) {
				var layer = layerManager.layers[i];

				var layerModel = Ext.create('LTP.LayerModel');
				layerModel.data = layer;

				store.insert(0, [layerModel]);
			}
		},

		_onCanvasContentChange: function(canvas) {
			var record = this.viewStore.getById(canvas.layerId);
			if (record) {
				record.commit();
			}
		},

		_deleteOrMergeAt: function(index, action) {
			var layer = this.viewStore.getAt(index);
			var actionCapitalized = Ext.String.capitalize(action);

			var msg = Ext.String.format("Really {0} '{1}'? <br/>This cannot be undone.", action, layer.get('layerName'));
			Ext.MessageBox.confirm(actionCapitalized + " Layer", msg, function(button) {
				if (button === 'yes') {
					var result = this.layerManager[action + "LayerByLayer"](layer.data);
					if (result) {
						this.viewStore.remove(layer);
					}
				}
			},
			this);
		}
	});

})();


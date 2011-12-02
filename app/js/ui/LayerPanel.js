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
			this._messageBus.subscribe('newLayerCreated', this._onNewLayerCreated, this);
			this._messageBus.subscribe('layerLoad', this._onCanvasContentChange, this);
			this._messageBus.subscribe('activeLayerChanged', this._onActiveLayerChanged, this);
			this._messageBus.subscribe('layerRemoved', this._onLayerRemoved, this);
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
					text: 'Flatten',
					listeners: {
						click: this._onFlattenClick,
						scope: this
					}
				}]
			}];

			this.items = [{
				xtype: 'grid',
				hideHeaders: true,
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
					dataIndex: 'layerName',
					flex: 2,
					field: {
						xtype: 'textfield'
					},
					menuDisabled: true
				},
				{
					xtype: 'templatecolumn',
					tpl: '<div style="height:{thumbnailHeight}px; width:{thumbnailWidth}px"><img class="thumbnail" src="{thumbnailData}" /></div>',
					flex: 1,
					dataIndex: 'thumbnailData',
					menuDisabled: true
				},
				{
					xtype: 'actioncolumn',
					width: 75,
					items: [{
						icon: '/images/visible.png',
						getClass: this._getVisibleIcon,
						tooltip: 'Toggle visibility',
						handler: function(grid, rowIndex, colIndex) {
							this.up('#layerPanel')._toggleVisibilityAt(rowIndex);
						}
					},
					{
						icon: '/images/merge.png',
						getClass: this._getMergeIcon,
						tooltip: 'Merge into layer below',
						handler: function(grid, rowIndex, colIndex) {
							this.up('#layerPanel')._deleteOrMergeAt(rowIndex, 'merge');
						}
					},
					{
						icon: '/images/delete.png',
						tooltip: 'Delete',
						iconCls: 'x-grid-center-icon',
						handler: function(grid, rowIndex, colIndex) {
							this.up('#layerPanel')._deleteOrMergeAt(rowIndex, 'delete');
						}
					}],
					menuDisabled: true
				}],
				selType: 'rowmodel',
				plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 2,
					listeners: {
						edit: function(editor, e) {
							editor.context.record.commit();
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

		_getMergeIcon: function(value, meta, record, rowIndex, ColIndex, store) {
			return rowIndex < store.count() - 1 ? 'x-grid-center-icon' : 'x-hide-display';
		},

		_getVisibleIcon: function(value,meta, record) {
			return record.get('isVisible') ? 'x-grid-center-icon' : 'x-grid-center-icon closed-eye-visibility';
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

		_onFlattenClick: function() {
			Ext.MessageBox.confirm("Flatten?", "Flatten all layers into one?<br/> This cannot be undone", function(button) {
				if (button === 'yes') {
					this.layerManager.flatten();
				}
			},
			this);
		},
		
		_onNewLayerCreated: function(newLayer) {
			var layerModel = Ext.create('LTP.LayerModel');
			layerModel.data = newLayer;

			this.viewStore.insert(0, [layerModel]);

			var grid = this.down('#layerGrid');
			grid.getSelectionModel().select(layerModel, false);
		},

		_onNewClick: function() {
			this.layerManager.addNewLayer();
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
			var record = this._findRecordByCanvas(canvas);
			if (record) {
				record.commit();
			}
		},

		_onActiveLayerChanged: function(layer) {
			var record = this._findRecordByCanvas(layer);
			if (record) {
				var grid = this.down('#layerGrid');
				grid.getSelectionModel().select(record, false);
			}
		},

		_onLayerRemoved: function(layer) {
			var record = this._findRecordByCanvas(layer);
			if (record) {
				this.viewStore.remove(record);
			}
		},

		_findRecordByCanvas: function(canvas) {
			var foundRecord;

			this.viewStore.each(function(record) {
				if (record.data === canvas) {
					foundRecord = record;
					return false;
				}
			});

			return foundRecord;
		},

		_toggleVisibilityAt: function(index) {
			var layer = this.viewStore.getAt(index);
			layer.set('isVisible', !layer.get('isVisible'));
			layer.commit();
		},

		_deleteOrMergeAt: function(index, action) {
			var layer = this.viewStore.getAt(index);
			var actionCapitalized = Ext.String.capitalize(action);

			var msg = Ext.String.format("Really {0} '{1}'? <br/>This cannot be undone.", action, layer.get('layerName'));
			Ext.MessageBox.confirm(actionCapitalized + " Layer", msg, function(button) {
				if (button === 'yes') {
					this.layerManager[action + "LayerByLayer"](layer.data);
				}
			},
			this);
		}
	});

})();


(function() {
	Ext.define('LTP.LayerModel', {
		extend: 'Ext.data.Model',
		fields: [
			{	name: 'layerName', type: 'string' },
			{ name: 'index', type: 'integer' },
			{ name: 'isVisible', type: 'boolean' },
			{ name: 'isActive', type: 'boolean' }
		]
	});

	Ext.define('LTP.LayerPanel', {
		extend: 'Ext.container.Container',
		layout: 'fit',

		initComponent: function() {
			var store = Ext.create('Ext.data.Store', {
				model: 'LTP.LayerModel'
			});

			this.viewStore = store;
			var me = this;

			this.items = [{
				xtype: 'grid',
				multiSelect: false,
    		viewConfig: {
        		plugins: {
            		ptype: 'gridviewdragdrop',
            		dragText: 'Drag and drop to reorganize'
        		},
						listeners: {
							beforedrop: function(node, data, overModel, dropPosition, dropFunction, options) {
								if(data.records[0].data.isBackground || (overModel.data.isBackground && dropPosition === 'after')) {
									return false;
								}
								return true;
							},
							drop: function(node, data, overModel, dropPosition) {
								var suffix = dropPosition === 'before' ? 'Ahead' : 'Behind';
								me.layerManager['moveLayer' + suffix](data.records[0].data, overModel.data);
							}
						}
    		},
				store: store,
				minHeight: 100,
				columns: [
					{
						xtype: 'booleancolumn',
						trueText: 'V',
						falseText: '-',
						header: 'V', 
						dataIndex: 'isVisible',
						width: 30,
						field: {
							xtype: 'checkboxfield'
						}
					},
					{
						header: 'Name',
						dataIndex: 'layerName',
						flex: 1,
						field: {
							xtype: 'textfield'
						}
					}
				],
    		selType: 'rowmodel',
    		plugins: [
        		Ext.create('Ext.grid.plugin.RowEditing', {
            		clicksToEdit: 2
        		})
    		],
				listeners: {
					selectionchange: this._selectionChange,
					scope: this
				}
			},
			{
				xtype: 'button',
				text: 'New',
				listeners: {
					click: this._onNewClick,
					scope: this
				}
			}];

			this.callParent(arguments);
		},

		load: function(layerManager) {
			this.layerManager = layerManager;
			this._addLayersToStore(this.viewStore, layerManager);
		},

		_selectionChange: function(selectionModel, selectedRecords, options) {
			if(selectedRecords && selectedRecords.length) {
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
			for(var i = 0; i < layerManager.layers.length; ++i) {
				var layer = layerManager.layers[i];

				var layerModel = Ext.create('LTP.LayerModel');//, {
				layerModel.data = layer;

				store.insert(0, [layerModel]);
			}
		}
	});

})();

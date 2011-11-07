(function() {
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
				itemId: 'layerGrid',
				multiSelect: false,
				sortableColumns: false,
    		viewConfig: {
        		plugins: {
            		ptype: 'gridviewdragdrop',
            		dragText: 'Drag and drop to reorganize'
        		},
						listeners: {
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
						trueText: '<img src="visible.png" />',
						falseText: ' ',
						header: '', 
						dataIndex: 'isVisible',
						width: 30,
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

				var layerModel = Ext.create('LTP.LayerModel');
				layerModel.data = layer;

				store.insert(0, [layerModel]);
			}
		},

		saveProject2: function(id, name, size) {
			var project = Ext.create('LTP.ProjectModel', {
				id: id,
				name: name,
				width: size.width,
				height: size.height
			});

			project.save();

			var layers = project.layers();
			this.viewStore.each(function(layer) {
				layers.add(layer);
			});

			layers.sync();
		},

		saveProject: function(id, name, size) {
			debugger;
			var projectStore = Ext.create('Ext.data.Store', {
				model: 'LTP.ProjectModel'
			});

			projectStore.add({
				id: id,
				name: name,
				width: size.width,
				height: size.height
			});
			projectStore.sync();

			var project = projectStore.first();

			var layers = project.layers();
			this.viewStore.each(function(layer) {
				layers.add(layer);
			});

			layers.sync();
		}
	});

})();


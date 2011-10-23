(function() {
	Ext.define('LTP.LayerModel', {
		extend: 'Ext.data.Model',
		fields: [
			{	name: 'layerName' },
			{ name: 'index' },
			{ name: 'visible' },
			{ name: 'active' },
			{ name: 'canvas' }
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

			this.items = {
				xtype: 'dataview',
				store: store,
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<div>{layerName}</div>',
					'</tpl>'
				)
			};

			this.callParent(arguments);
		},

		load: function(layerManager) {
			this._addLayersToStore(this.viewStore, layerManager);
		},

		_addLayersToStore: function(store, layerManager) {
			for(var i = 0; i < layerManager.layers.length; ++i) {
				var layer = layerManager.layers[i];

				var layerModel = Ext.create('LTP.LayerModel', {});//, {
					//name: layer.layerName,
					//index: layer.zIndex,
					//visible: layer.isVisible,
					//active: layer === layerManager.activeLayer,
					//canvas: layer
				//});
				layerModel.data = layer;

				store.add(layerModel);
			}
		}
	});

})();


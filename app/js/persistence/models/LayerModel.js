(function() {
	Ext.define('LTP.LayerModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{ name: 'project_id', type: 'integer' },
			{	name: 'layerName', type: 'string' },
			{ name: 'index', type: 'integer' },
			{ name: 'isVisible', type: 'boolean' },
			{ name: 'isActive', type: 'boolean' },
			{ name: 'data', type: 'string' }
		],

		proxy: {
			type: 'localstorage',
			id: 'ltp-layers'
		}
	});
})();


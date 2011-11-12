(function() {
	Ext.define('LTP.LayerModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'layerId', type: 'integer' },
			{ name: 'ltp.projectmodel_id', type: 'integer' },
			{	name: 'layerName', type: 'string' },
			{ name: 'index', type: 'integer' },
			{ name: 'isVisible', type: 'boolean' },
			{ name: 'data', type: 'string' }
		],

		associations: [
			{ type: 'belongsTo', model: 'LTP.ProjectModel', name: 'project' }
		],

		idProperty: 'layerId',

		proxy: {
			type: 'localstorage',
			id: 'ltp-layers'
		}
	});
})();


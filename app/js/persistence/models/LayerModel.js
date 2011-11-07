(function() {
	Ext.define('LTP.LayerModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{ name: 'ltp.projectmodel_id', type: 'integer' },
			{	name: 'layerName', type: 'string' },
			{ name: 'index', type: 'integer' },
			{ name: 'isVisible', type: 'boolean' },
			{ name: 'data', type: 'string' }
		],

		associations: [
			{ type: 'belongsTo', model: 'LTP.ProjectModel', name: 'project' }
		],

		proxy: {
			type: 'localstorage',
			id: 'ltp-layers'
		}
	});
})();


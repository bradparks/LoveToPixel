(function() {
	Ext.define('LTP.ProjectModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{	name: 'name', type: 'string' }
		],

		associations: [
			{ type: 'hasMany', model: 'LTP.LayerModel', name: 'layers' }
		],

		proxy: {
			type: 'localstorage',
			id: 'ltp-projects'
		}
	});
})();


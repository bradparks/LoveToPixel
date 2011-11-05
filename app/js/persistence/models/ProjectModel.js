(function() {
	Ext.define('LTP.ProjectModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{	name: 'name', type: 'string' },
			//{ name: 'createdAt', type: 'date' },
			//{ name: 'lastModifiedAt', type: 'date' },
			{ name: 'width', type: 'integer' },
			{ name: 'height', type: 'integer' }
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


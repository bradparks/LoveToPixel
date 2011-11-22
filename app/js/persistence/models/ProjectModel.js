(function() {
	Ext.define('LTP.ProjectModel', {
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{	name: 'name', type: 'string' },
			{ name: 'width', type: 'integer' },
			{ name: 'height', type: 'integer' },
			{ name: 'palette', type: 'string' },
			{ name: 'lastSaved', type: 'date' }
		],

		associations: [
			{ type: 'hasMany', model: 'LTP.LayerModel', name: 'layers', autoLoad: true }
		],

		proxy: {
			type: 'localstorage',
			id: 'ltp-projects'
		}
	});
})();


(function() {
	LTP.ProjectPersister = function ProjectPersister() {
		this._projectStore = Ext.create('Ext.data.Store', {
			model: 'LTP.ProjectModel',
			autoLoad: false
		});
	};

	LTP.ProjectPersister.prototype = {
		loadAllProjects: function pp_loadAllProjects(callback, scope) {
			this._projectStore.load({
				scope: this,
				callback: function() {
					this._projects = this._extract(this._projectStore);
					callback.call(scope, this._projects);
				}
			});
		},

		saveProject: function(project, layers) {
			project.width = project.size.width;
			project.height = project.size.height;

			var projectRecord = this._projectStore.getById(project.id) || this._projectStore.add(project)[0];
			projectRecord.data = project;
			projectRecord.dirty = true;
			this._projectStore.sync();

			var layerStore = projectRecord.layers();

			Ext.Array.each(layers, function(layer) {
				var layerRecord = layerStore.getById(layer.layerId) || layerStore.add(layer)[0];
				layerRecord.data = layer;
				layerRecord.dirty = true;
				layerStore.add(layerRecord);
			});

			layerStore.sync();
		},

		_extract: function(projectStore) {
			var projects = [];
			projectStore.each(function(projectRecord) {
				var project = projectRecord.data;
				project.size = s(project.width, project.height);
				project.layers = [];

				var layerStore = projectRecord.layers();
				layerStore.each(function(layerRecord) {
					project.layers.push(layerRecord.data);
				});

				projects.push(project);
			});

			return projects;
		}
	};

})();


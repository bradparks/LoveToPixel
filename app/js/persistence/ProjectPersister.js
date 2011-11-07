(function() {
	LTP.ProjectPersister = function ProjectPersister() {
		this._projectStore = Ext.create('Ext.data.Store', {
			model: 'LTP.ProjectModel',
			autoLoad: false
		});
	};

	LTP.ProjectPersister.prototype = {
		get projects() {
			var projects = [];
			this._projectStore.each(function(project) {
				project.data.size = s(project.data.width, project.data.height);
				if (!project.data.layers) {
					var layers = [];
					var layerStore = project.layers();
					layerStore.load();
					layerStore.each(function(layerRecord) {
						layers.push(layerRecord.data);
					});
					project.data.layers = layers;
				}
				projects.push(project.data);
			});

			return projects;
		},

		loadAllProjects: function pp_loadAllProjects(callback, scope) {
			this._projectStore.load({
				scope: this,
				callback: function() {
					this._setMaxProjectId(this.projects);
					callback.call(scope, this.projects);
				}
			});
		},

		getProject: function pp_getProject(id) {
			var index = this._projectStore.find("id", id);
			if (index > - 1) {
				return this._projectStore.getAt(index);
			} else {
				return null;
			}
		},

		saveProject: function pp_saveProject(project, layers) {
			if (typeof project.id !== 'number') {
				project.id = ++this._maxId;
				project.width = project.size.width;
				project.height = project.size.height;
			}

			delete project.layers;

			var projectRecord = Ext.create('LTP.ProjectModel', project);
			projectRecord.save();

			var layerStore = projectRecord.layers();
			layerStore.load();
			layerStore.removeAll();
			layerStore.sync();

			Ext.Array.each(layers, function(layer) {
				var layerRecord = Ext.create('LTP.LayerModel');
				layerRecord.data = layer;
				layerStore.add(layerRecord);
			});

			layerStore.sync();
		},

		_setMaxProjectId: function(projects) {
			var max = - 10000;

			Ext.Array.each(projects, function(project) {
				if (project.id > max) {
					max = project.id;
				}
			});

			this._maxId = Math.max(0, max);
		}

	};

})();


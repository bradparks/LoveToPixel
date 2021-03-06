(function() {
	LTP.ProjectPersister = function ProjectPersister() {
		this._projectStore = Ext.create('Ext.data.Store', {
			model: 'LTP.ProjectModel',
			autoLoad: false
		});
	};

	LTP.ProjectPersister.prototype = {
		loadAllProjects: function(callback, scope) {
			this._projectStore.load({
				scope: this,
				callback: function() {
					this._extract(this._projectStore, callback, scope);
				}
			});
		},

		saveProject: function(project, layers, paletteString) {
			project.width = project.size.width;
			project.height = project.size.height;
			project.lastSaved = new Date();
			project.palette = paletteString;

			var projectRecord;

			if (project.id) {
				projectRecord = this._projectStore.getById(project.id);
			} else {
				projectRecord = this._projectStore.add({})[0];
			}

			projectRecord.data = project;
			projectRecord.dirty = true;
			this._projectStore.sync();

			var layerStore = projectRecord.layers();

			Ext.Array.each(layers, function(layer) {
				var layerRecord;

				if (layer.layerId) {
					layerRecord = layerStore.getById(layer.layerId);
				} else {
					layerRecord = layerStore.add({})[0];
				}

				layerRecord.data = layer;
				layerRecord.dirty = true;
				layerStore.add(layerRecord);
			});

			// any layer record that is not set dirty is 
			// a layer the user actually deleted. We don't really
			// delete them until we are here incase the user changes
			// their mind and decides to not save their project
			layerStore.each(function(layerRecord) {
				if(!layerRecord.dirty) {
					layerRecord.destroy();
				}
			});

			layerStore.sync();
		},

		_extract: function(projectStore, callback, scope) {
			this.projects = [];
			var me = this;
			var pendingCount = projectStore.count();

			if (pendingCount === 0) {
				callback.call(scope, me.projects);
			} else {
				projectStore.each(function(projectRecord) {
					var project = projectRecord.data;
					project.size = s(project.width, project.height);
					project.layers = [];

					var layerStore = projectRecord.layers();
					layerStore.each(function(layerRecord) {
						project.layers.push(layerRecord.data);
					});

					this._createThumbnail(project, function() {--pendingCount;
						if (pendingCount === 0) {
							callback.call(scope, me.projects);
						}
					});

					this.projects.push(project);
				},
				this);
			}
		},

		_createThumbnail: function(project, callback) {
			var layerManager = new LTP.LayerManager(project, new LTP.MessageBus(LTP.GlobalMessages));

			LTP.util.waitFor(function() {
				return layerManager.dataLoaded;
			},
			function() {

				var composite = layerManager.composite(s(200, 100));
				project.thumbnailData = composite.toDataURL();
				project.thumbnailHeight = composite.height;
				project.thumbnailWidth = composite.width;

				callback();
			});
		}
	};

})();


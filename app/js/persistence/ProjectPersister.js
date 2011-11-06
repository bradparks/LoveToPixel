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
				projects.push(project);
			});

			return projects;
		},

		loadAllProjects: function pp_loadAllProjects(callback, scope) {
			this._projectStore.load({
				scope: this,
				callback: function() {
					callback.call(scope, this.projects);
				}
			});
		},

		getProject: function pp_getProject(id) {
			var index = this._projectStore.find("id", id);
			if(index > -1) {
				return this._projectStore.getAt(index);
			} else {
				return null;
			}
		},

		saveProject: function pp_saveProject(project) {
			
		}

	};

})();


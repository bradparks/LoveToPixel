describe("ProjectPersister", function() {
	describe("saving", function() {
		beforeEach(function() {
			localStorage.clear();
		});

		it("should save the project correctly", function() {
			var width = 100;
			var height = 30;
			var projectName = "testProject";
			var layerName = "testLayer";
			var layerIndex = 7;
			var layerVisible = true;
			var layerData = "this is my test layer data, definitely not a data url";

			var project = {
				size: s(width, height),
				name: projectName,
			};

			var layers = [{
				layerName: layerName,
				index: layerIndex,
				isVisible: layerVisible,
				data: layerData
			}];

			var persister = new LTP.ProjectPersister();

			persister.saveProject(project, layers);

			expect(localStorage.length).not.toEqual(0);
			expect(project.id).toBeDefined();

			var fromStorageProject = JSON.parse(localStorage[LTP.ProjectModel.proxy.id + '-' + project[LTP.ProjectModel.prototype.idProperty]]);

			expect(fromStorageProject.name).toEqual(projectName);
			expect(fromStorageProject.width).toEqual(width);
			expect(fromStorageProject.height).toEqual(height);

			var today = new Date();
			var savedDate = new Date(fromStorageProject.lastSaved);

			expect(savedDate.getDate()).toEqual(today.getDate());
			expect(savedDate.getFullYear()).toEqual(today.getFullYear());
			expect(savedDate.getMonth()).toEqual(today.getMonth());

			var layerKey = LTP.LayerModel.proxy.id + '-' + layers[0][LTP.LayerModel.prototype.idProperty];
			var fromStorageLayer = JSON.parse(localStorage[layerKey]);
			expect(fromStorageLayer.layerId).toEqual(layers[0].layerId);
			expect(fromStorageLayer.layerName).toEqual(layerName);
			expect(fromStorageLayer.data).toEqual(layerData);

			expect(fromStorageLayer['ltp.projectmodel_id']).toEqual(fromStorageProject.id);
		});

		it("should not create duplicate layers or projects on subsequent saves", function() {
			var dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVQIHWNgYGD4DwQMjCACBABG1Ab7LOydWwAAAABJRU5ErkJggg==';
			function layerCount() {
				return parseInt(localStorage[LTP.LayerModel.proxy.id + '-counter']);
			}

			function projectCount() {
				return parseInt(localStorage[LTP.ProjectModel.proxy.id + '-counter']);
			}

			runs(function() {
				var project = {
					size: s(3, 4),
					name: 'testProject'
				};

				var layers = [{
					layerName: 'foo',
					data: dataUrl
				},
				{
					layerName: 'bar',
					data: dataUrl
				},
				{
					layerName: 'baz',
					data: dataUrl
				}];

				this.persister = new LTP.ProjectPersister();
				this.persister.saveProject(project, layers);

				expect(layerCount()).toEqual(layers.length);
				expect(projectCount()).toEqual(1);

				this.persister.loadAllProjects(function(projects) {
					this.projects = projects;
				}, this);
			});

			waits(300);

			runs(function() {
				var project = this.projects[0];
				var layers = project.layers;
				this.persister.saveProject(project, layers);
				expect(projectCount()).toEqual(1);
				expect(layerCount()).toEqual(layers.length);
			});

		});
	});

});


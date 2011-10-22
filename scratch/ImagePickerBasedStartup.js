
Ext.onReady(function() {
	LTP.init();

	var store = Ext.create('LTP.ProjectStore');

	Ext.create('LTP.ProjectPicker', {
		store: store,
		listeners: {
			projectSelected: LTP.load,
			scope: LTP
		}
	});

});

LTP.zoomLevels = [.25, .5, 1, 2, 4, 8, 16, 32];
LTP.gridLevels = [5, 10, 15, 20, 20000];


LTP.init = function(config) {
	Ext.apply(this, config);

	this.statusBar = Ext.create('LTP.StatusBar', {
		renderTo: this.statusBarContainerId
	});

	//this.toolBar = Ext.create('LTP.Toolbar', {
		//renderTo: toolbarContainerId
	//});
};

LTP._destroyAll() {
	var component;

	if(this._components) {
		for(var i = 0; i < this._components.length; ++i) {
			component = this._components[i];
	
			if(typeof component.destroy === 'function') {
				component.destroy();
			}
		}
	}
};

LTP.load = function(project) {
	var size = project.imageSize;

	this._destroyAll();
	this._components = [];

	this.layerManager = new LTP.LayerManager(size, 'white');
	this._components.push(this.layerManager);

	this.container = new LTP.Container(document.getElementById(this.containerContainerId));
	this._components.push(this.container);

	this.painter = new LTP.Painter(size, new LTP.PointTransformer());
	this._components.push(this.painter);

	this.grid = new LTP.Grid(size, 'gray', 5);
	this._components.push(this.grid);
};



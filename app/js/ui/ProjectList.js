(function() {
	Ext.define('LTP.ProjectList', {
		extend: 'Ext.grid.Panel',
		alias: 'widget.ltp.projectlist',
		layout: 'fit',
		multiSelect: false,
		selType: 'rowmodel',
		sortableColumns: false,
		border: false,
		viewConfig: {
			emptyText: "<div class='emptyGridText'>You have no saved projects. Start a new project above, then when you save it with 's' it will show up here</div>",
			deferEmptyText: false
		},

		initComponent: function() {
			this.columns = [{
				header: 'Thumbnail',
				xtype: 'templatecolumn',
				tpl: '<div style="height:{thumbnailHeight}px; width:{thumbnailWidth}px"><img class="thumbnail" src="{thumbnailData}" /></div>',
				flex: 1,
				dataIndex: 'thumbnailData',
				menuDisabled: true
			},
			{
				header: 'Name',
				dataIndex: 'name',
				menuDisabled: true
			},
			{
				header: 'Last Saved',
				xtype: 'datecolumn',
				dataIndex: 'lastSaved',
				menuDisabled: true
			},
			{
				xtype: 'actioncolumn',
				header: 'Delete',
				width: 50,
				menuDisabled: true,
				items: [{
					icon: '/images/delete.png',
					iconCls: 'x-grid-center-icon',
					handler: function(grid, rowIndex, colIndex) {
						this.up('panel').deleteAt(rowIndex);
					}
				}]
			}],
			this.store = Ext.create('Ext.data.Store', {
				model: 'LTP.ProjectModel',
				data: this.projects,
				sorters: [{
					property: 'lastSaved',
					direction: 'DESC'
				}]
			});

			this.callParent(arguments);
		},

		getSelectedProject: function() {
			var s = this.getSelectionModel().getSelection();
			return s && s.length && s[0] && s[0].data;
		},

		deleteAt: function(index) {
			Ext.MessageBox.confirm('Delete?', 'Really delete this project?', function(buttonId) {
				if (buttonId === 'yes') {
					var record = this.store.getAt(index);

					if (record) {
						var layerStore = record.layers();

						layerStore.each(function(layerRecord) {
							layerRecord.destroy();
						});
						layerStore.sync();

						this.store.remove(record);
						this.store.sync();
					}
				}
			},
			this);
		}
	});

})();


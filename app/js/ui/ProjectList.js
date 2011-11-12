(function() {
	Ext.define('LTP.ProjectList', {
		extend: 'Ext.grid.Panel',
		alias: 'widget.ltp.projectlist',
		layout: 'fit',
		multiSelect: false,
		selType: 'rowmodel',
		sortableColumns: false,

		initComponent: function() {
			this.columns = [{
				header: 'Name',
				dataIndex: 'name',
				menuDisabled: true
			},
			{
				header: 'Last Saved',
				xtype: 'datecolumn',
				dataIndex: 'lastSaved',
			},
			{
				header: 'Thumbnail',
				xtype: 'templatecolumn',
				tpl: '<div style="height:{thumbnailHeight}px; width:{thumbnailWidth}px"><img class="thumbnail" src="{thumbnailData}" /></div>',
				flex: 1,
				dataIndex: 'thumbnailData'
			},
			{
				xtype: 'actioncolumn',
				header: 'Delete',
				width: 50,
				items: [{
					icon: '/images/delete.png',
					handler: function(grid, rowIndex, colIndex) {
						this.up('panel').deleteAt(rowIndex);
					}
				}]
			}],
			this.store = Ext.create('Ext.data.Store', {
				model: 'LTP.ProjectModel',
				data: this.projects
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
					this.store.removeAt(index);
					this.store.sync();
				}
			}, this);
		}
	});

})();


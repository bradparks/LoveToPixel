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
				dataIndex: 'Name',
				menuDisabled: true
			},
			{
				header: 'Thumbnail',
				xtype: 'templatecolumn',
				tpl: '<div style="height:{ThumbnailHeight}px"><img src="{Thumbnail}" /></div>',
				flex: 1,
				dataIndex: 'Thumbnail'
			}],
			this.store = Ext.create('Ext.data.Store', {
				model: 'LTP.ProjectModel',
				data: this.projects
			});

			this.callParent(arguments);
		},

		getSelectedProject: function() {
			var s = this.getSelectionModel().getSelection();
			return s && s.length && s[0];
		}
	});

})();


(function() {
	Ext.define('LTP.Publisher', {
		extend: 'Ext.window.Window',
		alias: 'widget.ltp.publisher',
		title: 'Publish',
		//width: 600,
		//height: 400,
		//layout: {
		//type: 'vbox',
		//align: 'center'
		//},
		items: [{
			xtype: 'container',
			html: 'This image will get uploaded to Imgur',
			margin: 10,
		},
		{
			xtype: 'container',
			itemId: 'thumbnail',
			margin: 10,
			html: '<img id="_publisherThumbnailImg" class="thumbnail" alt="thumbnail of what is going to be published" />'
		},
		{
			xtype: 'textfield',
			itemId: 'titleField',
			fieldLabel: 'Title',
			margin: 10,
			enableKeyEvents: true,
			listeners: {
				keydown: function(text, e) {
					if (e.keyCode === Ext.EventObject.ENTER) {
						var parent = this.up('window');
						parent._publishClick();
					}
				}
			}

		},
		{
			xtype: 'container',
			itemId: 'resultContainer'
		}],

		buttons: [{
			text: 'Publish',
			itemId: 'publishButton',
			handler: function() {
				this.up('window')._publishClick();
			}
		},
		{
			text: 'Cancel',
			itemId: 'closeButton',
			handler: function() {
				this.up('window').close();
			}
		}],

		constructor: function(config) {
			this.callParent(arguments);
			Ext.apply(this, config);
		},

		initComponent: function() {
			this.callParent(arguments);
			this.on('afterrender', this._onAfterRender, this);
		},

		_onAfterRender: function() {
			var composite = this.layerManager.composite(s(300, 300));

			Ext.fly('_publisherThumbnailImg').dom.src = composite.toDataURL();
			this.down('#thumbnail').setHeight(composite.height + 20);
			this.setWidth(Math.max(composite.width + 50, 300));

			this.down('#titleField').setValue(this.projectName);
		},

		_publishClick: function() {
			var mask = Ext.create('Ext.LoadMask', this.el, {
				msg: "Uploading..."
			});
			mask.show();

			this.down('#publishButton').setDisabled(true);
			this.down('#closeButton').setText('OK');
			var imgurTitle = this.down('#titleField').getValue();

			var me = this;

			this._publish(imgurTitle, function(result) {
				var resultContainer = me.down('#resultContainer');
				resultContainer.add({
					xtype: 'container',
					html: result.message,
					margin: 10
				});

				if (result.success) {
					resultContainer.add({
						xtype: 'container',
						html: Ext.String.format('<a href="http://www.reddit.com/r/pixelart/submit?url={0}&title={1}" target="_blank">Submit to Reddit</a>', result.imgurImgLink, encodeURI(result.imgurTitle)),
						margin: 10
					});
				}
				mask.destroy();
			});
		},

		_publish: function(imgurTitle, callback) {
			var composite = this.layerManager.composite();
			var imgData = composite.toDataURL('image/png').split(',')[1];

			var connection = Ext.create('Ext.data.Connection', {
				useDefaultXhrHeader: false
			});

			connection.request({
				cors: true,
				url: 'http://api.imgur.com/2/upload.json',
				type: 'POST',
				params: {
					type: 'base64',
					key: 'c61f0d1212952dc31b6bd8311493ecea',
					name: imgurTitle,
					title: imgurTitle,
					caption: 'Created with love to pixel, http://www.lovetopixel.com',
					image: imgData
				},
				success: function(response, options) {
					var result = JSON.parse(response.responseText);
					var imgurLink = result.upload.links.imgur_page;
					var imgurImgLink = result.upload.links.original;

					callback({
						success: true,
						imgurTitle: imgurTitle,
						imgurLink: imgurLink,
						imgurImgLink: imgurImgLink,
						message: Ext.String.format('Published to <a href="{0}" target="_blank">{0}</a>', imgurLink)
					});
				},
				failure: function() {
					callback({
						success: false,
						message: "There was an error publishing to Imgur, please try again later"
					});
				},
				scope: this
			});
		}
	});
})();


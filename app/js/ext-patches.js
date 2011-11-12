Ext.override(Ext.data.proxy.WebStorage, {
	setRecord: function(record, id) {
		if (id) {
			record.setId(id);
		} else {
			id = record.getId();
		}

		var me = this,
		rawData = record.data,
		data = {},
		model = me.model,
		fields = model.prototype.fields.items,
		length = fields.length,
		i = 0,
		field, name, obj, key;

		for (; i < length; i++) {
			field = fields[i];
			name = field.name;

			if (field.persist !== false) {
				if (typeof field.encode == 'function') {
					data[name] = field.encode(rawData[name], record);
				} else {
					data[name] = rawData[name];
				}
			}
		}

		obj = me.getStorageObject();
		key = me.getRecordKey(id);

		//keep the cache up to date
		me.cache[id] = record;

		//iPad bug requires that we remove the item before setting it
		obj.removeItem(key);
		obj.setItem(key, Ext.encode(data));
	}
});


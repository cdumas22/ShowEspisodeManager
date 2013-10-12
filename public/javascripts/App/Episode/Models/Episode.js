define(["backbone", 'radio'], function (Backbone, Radio) {
    return Backbone.Model.extend({
        urlRoot: function() {
            return "shows/" + this.collection.show.get("_id") + "/episodes";
        },
        idAttribute: "_id",
        initialize: function() {
            Radio(this.get('_id') + ':update').subscribe([this.serverChange, this]);
            Radio(this.get('_id') + ':delete').subscribe([this.serverDelete, this]);
        },
        lock: function(options) {
            if(!this.isNew() && this.get('lock') === false) {
                this.save('lock', true, options);
            }
        },
        unlock: function(options) {
            if(!this.isNew() && this.get('lock') === true) {
                this.save('lock', false, options);
            }
        },
        serverChange: function(data) {
        	this.set(data);
        },
        serverDelete: function(data) {
        	Radio(this.get('_id') + ':update').unsubscribe(this.serverChange);
            Radio(this.get('_id') + ':delete').unsubscribe(this.serverDelete);	
        	if(this.collection) {
        		this.collection.remove(this);
        	} else {
        		this.trigger('destroy', this);
                this.trigger('remove', this);
        	}
        }
    });
});
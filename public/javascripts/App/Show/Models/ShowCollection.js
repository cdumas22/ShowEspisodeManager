define(["backbone", "Show/Models/Show", 'radio'], function (Backbone, ShowModel, Radio) {
    return Backbone.Collection.extend({
        model: ShowModel,
        url: "/shows",
        initialize: function() {
        	Radio('shows:create').subscribe([this.serverCreate, this]);
        },
        serverCreate: function(data) {
        	this.add(data);
        }
    });
});
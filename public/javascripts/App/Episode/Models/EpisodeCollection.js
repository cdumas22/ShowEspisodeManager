define(["backbone", "Episode/Models/Episode", 'radio'], function (Backbone, EpisodeModel, Radio) {
    return Backbone.Collection.extend({
        model: EpisodeModel,
        url: function(){
            return "shows/" + this.show.get("_id") + "/episodes";
        },
        initialize: function(options){
            options || (options = {});
            this.show = options.show;
            this.listenTo(this.show, 'remove', this.destroy);
        
            Radio('episodes/' + this.show.get('_id') + ':create').subscribe([this.serverCreate, this]);
            Radio('shows/' + this.show.get('_id') + ':delete').subscribe([this.serverShowDelete, this]);
        },
        serverShowDelete: function(data) {
            Radio('episodes/' + this.show.get('_id') + ':create').unsubscribe(this.serverCreate);
            Radio('shows/' + this.show.get('_id') + ':delete').unsubscribe(this.serverShowDelete);
        },
        serverCreate: function(data) {
            this.add(data);
        }
    });
});
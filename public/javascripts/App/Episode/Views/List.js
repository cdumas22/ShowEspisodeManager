define(["backbone", "underscore", "text!Episode/Templates/List.html", "Episode/Views/ListItem"], function (Backbone, _, template, ListItem) {
    return Backbone.View.extend({
        className: "episode-list",
        template: _.template(template),
        initialize: function (options) {
            options || (options = {});
            this.collection = options.collection;

            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection.show, 'change:title', this.render);
            this.listenTo(this.collection.show, 'remove', this.root);
        },
        render: function () {
            this.$el.html(this.template({ show: this.collection.show.toJSON() }));
            this.addAll();
            return this;
        },
        root: function() {
            window.location.hash = "shows";
        },
        addAll: function () {
            this.$el.find('.models').children().remove();
            this.collection.each(this.addOne, this);
        },
        addOne: function (model) {
            var view = new ListItem({ model: model });
            this.$el.find('.models').append(view.render().el);
        }
    });
});
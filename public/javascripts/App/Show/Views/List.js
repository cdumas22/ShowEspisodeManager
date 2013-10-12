define(["backbone", "underscore", "text!Show/Templates/List.html",  "Show/Views/ListItem"], function (Backbone, _, template, ListItem) {   
    return Backbone.View.extend({
        className: "show-list",
        template: _.template(template),
        initialize: function (options) {
            options || (options = {});
            this.collection = options.collection;
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'add', this.addOne);
        },
        render: function () {
            var json = this.collection.toJSON();
            this.$el.html(this.template());
            this.addAll();
            return this;
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
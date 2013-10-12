define(["backbone", "underscore", "text!Show/Templates/ListItem.html"], function (Backbone, _, Template) {
    return Backbone.View.extend({
        tagName: "tr",
        template: _.template(Template),
        events: {
            "click a.remove": "destroy"
        },
        initialize: function (options) {
            options || (options = {});
            this.model = options.model;

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.clearLine);
            this.listenTo(this.model,'remove', this.clearLine);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        destroy: function (event) {
            event.stopPropagation();
            event.preventDefault();
            if (confirm("Are you sure you want to delete this item")) {
                this.model.destroy();
            }
        },
        clearLine: function() {
            this.$el.remove();
        }
    });
});
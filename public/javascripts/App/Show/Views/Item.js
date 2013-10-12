define(["backbone", "underscore", "text!Show/Templates/Item.html"], function (Backbone, _, template) {
    return Backbone.View.extend({
        className: "show-view",
        template: _.template(template),
        events: {
            "dblclick .field": "edit",
            "click button.save": "save",
            "click button.cancel": "edit"
        },
        //many of the event listeners are the same
        initialize: function (options) {
            options || (options = {});
            this.model = options.model;
            this.collection = options.collection || this.model.collection;

            if(this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.root);
            }

            this.initializeLock();
        },
        //common
        initializeLock: function() {
            var _this = this;
            if(this.model) {
                this.listenTo(this, 'remove', function() {
                    this.model.unlock();
                    $(window).off('unload');
                });
            }
            $(window).on('unload', function(){
                _this.model.unlock({async: false});
                $(window).off('unload');
            });
        },
        //common
        remove: function() {
            this.trigger('remove');
            Backbone.View.prototype.remove.call(this);
        },
        //the template is different
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.isNew()) {
                this.$el.addClass("editing");
            }
            return this;
        },
        //custom
        root: function() {
            window.location.hash = "shows";
        },
        //common
        //the root may be different but that is up to the user to define
        edit: function () {
            if (this.model.isNew()) {
                this.root();
            }

            if(!this.$el.hasClass("editing") && this.model.get("lock") === true) {
                return false;
            }

            if (this.$el.hasClass("editing")) {
                this.$el.removeClass("editing");
                this.model.unlock();
            } else {
                this.$el.addClass("editing");
                this.model.lock();
            }
        },
        //the set model part is different
        save: function (event) {
            event.stopPropagation();
            event.preventDefault();

            this.model.set({
                title: this.$el.find('input[name=title]').val(),
                description: this.$el.find('input[name=description]').val(),
                lock: false
            });

            this.edit();

            if (this.model.isNew()) {
                this.collection.create(this.model, {wait: true});
            } else {
                this.model.save();
            }

        }
    });
});
define(["backbone", "underscore", "text!Episode/Templates/Item.html"], function (Backbone, _, template) {
    return Backbone.View.extend({
        className: "episode-view",
        template: _.template(template),
        events: {
            "dblclick .field": "edit",
            "click button.save": "save",
            "click button.cancel": "edit"
        },
        initialize: function (options) {
            var _this = this;
            options || (options = {});
            this.model = options.model;
            this.collection = options.collection || this.model.collection;
            
            if(this.model) {
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.collection.show, 'change:title', this.render);
                this.listenTo(this.model, 'remove', this.episodeRoot);
                this.listenTo(this.collection.show, 'remove', this.root);
            }

            this.initializeLock();
        },
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
        render: function () {
            this.$el.html(this.template({ episode: this.model.toJSON(), show: this.collection.show.toJSON() }));
            if (this.model.isNew()) {
                this.$el.addClass("editing");
            }
            return this;
        },
        remove: function() {
            this.trigger('remove');
            Backbone.View.prototype.remove.call(this);
        },
        root: function() {
            window.location.hash = "shows";
        },
        episodeRoot: function() {
            window.location.hash = "shows/" + this.collection.show.get("_id") + "/episodes";
        },
        edit: function () {
            if (this.model.isNew()) {
                this.episodeRoot();
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
        save: function (event) {
            event.stopPropagation();
            event.preventDefault();

            this.model.set({
                title: this.$el.find('input[name=title]').val(),
                description: this.$el.find('input[name=description]').val(),
                show: this.collection.show,
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
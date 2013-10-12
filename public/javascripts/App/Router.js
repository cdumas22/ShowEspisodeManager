define([
    "backbone",
    "Show/Models/Show",
    "Episode/Models/Episode",
    "Controller"
], function (Backbone, ShowModel, EpisodeModel, Controller) {
    return Backbone.Router.extend({
        initialize: function (options) {
            options || (options = {});
            this.el = options.el;
        },
        //This is a general render function for the app, and will take care of making sure that the view is removed and then load in the new view
        render: function (view, viewOptions) {
            var _this = this;
            if (this.currentView) {
                this.currentView.remove();
            }
            require([view], function(v){
                _this.currentView = new v(viewOptions);
                _this.el.html(_this.currentView.render().el);
            });
        },
        routes: {
            "": "shows",

            "shows": "shows",
            "shows/new": "createShow",
            "shows/:id": "viewShow",

            "shows/:showid/episodes/new": "createEpisode",
            "shows/:showid/episodes": "episodes",
            "shows/:showid/episodes/:id": "viewEpisode"
        },
        createShow: function () {
            this.render("Show/Views/Item", { model: new ShowModel(), collection: Controller.Collections.Shows });
        },
        shows: function () {
            this.render("Show/Views/List", { collection: Controller.GetShows() });
        },
        viewShow: function (id) {
            this.render("Show/Views/Item", { model: Controller.GetShow(id)});
        },

        createEpisode: function (showid) {
            this.render("Episode/Views/Item", { model: new EpisodeModel(), collection: Controller.NewEpisodesCollection(showid)});
        },
        episodes: function (showid) {
            this.render("Episode/Views/List", { collection: Controller.GetEpisodes(showid) });
        },
        viewEpisode: function (showid, id) {
            this.render("Episode/Views/Item", { model: Controller.GetEpisode(showid, id) });
        }
    });
});
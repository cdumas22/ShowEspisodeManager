define([
	"Show/Models/ShowCollection",
    "Show/Models/Show",
    "Episode/Models/EpisodeCollection",
    "Episode/Models/Episode",
    "radio"
	], 
function(ShowCollection, ShowModel, EpisodeCollection, EpisodeModel, Radio){
	var Collections = { Shows: new ShowCollection() };
	var GetShows = function() {
            Collections.Shows.fetch();
            return Collections.Shows;
        };
	var GetShow = function(showId) {
            var show = Collections.Shows.get(showId);
            if(show){
                return show;
            } else {
                show = new ShowModel({_id: showId});
                Collections.Shows.add(show);
                show.fetch();    
                return show;
            }
        };
	var NewEpisodesCollection = function(showId) {
        	if(!Collections[showId]) {//again we dont need to fetch the whole collection for just adding a new episode
                Collections[showId] = new EpisodeCollection({show: GetShow(showId)});
            }
            return Collections[showId];
        };
	var GetEpisodes = function(showId) {
            var collection = NewEpisodesCollection(showId);
            collection.fetch();
            return collection;
        };
	var GetEpisode = function(showId, episodeId) {
            var collection = NewEpisodesCollection(showId);
            var episode = collection.get(episodeId);
            if(episode) {
                return episode;
            } else {
                episode = new EpisodeModel({_id: episodeId, show: collection.show });
                collection.add(episode);
                episode.fetch();
                return episode;
            }
        };

    //if a show is deleted than remove the collection of its episodes
    //this will keep the data clean
    Radio('delete').subscribe([function(data){
        delete Collections[data._id];
    }, this]);

	return {
		//This is the central area to save all collections
		//we will start with an empty showCollection
		Collections: Collections,
		//CONTROLLER METHODS --Backbone doesn't have a controller but these methods do the same thing
        //the event listeners within the views will trigger their render method when values change, 
        //so on the ajax calls we dont care if all the data is available yet, only the minimal to build the view.
        //when the data becomes available the view will re-render
        GetShows: GetShows,
        GetShow: GetShow,
        NewEpisodesCollection: NewEpisodesCollection,
        GetEpisodes: GetEpisodes,
        GetEpisode: GetEpisode
        //end internal
    };
});
define("text!Episode/Templates/Item.html",[],function(){return'<ul class="breadcrumb">\r\n  <li><a href="#shows">Shows</a> <span class="divider">/</span></li>\r\n  <li><a href="#shows/<%=show._id%>"><%=show.title%></a> <span class="divider">/</span></li>\r\n  <li><a href="#shows/<%=show._id%>/episodes">Episodes</a> <span class="divider">/</span></li>\r\n  <li class="active"><%=episode.title%></li>\r\n</ul>\r\n<% if(episode.lock) {%>\r\n<div class="lock pull-right btn btn-danger">LOCKED</div>\r\n<% } %>\r\n<div class="controls">\r\n    <div class="title">\r\n        <h1 class="field"><%=episode.title%></h1>\r\n        <input class="edit" type="text" name="title" value="<%=episode.title%>" placeholder="Title"/>\r\n    </div>\r\n    <div>\r\n        <h3 class="field">SHOW: <%=show.title%></h3>\r\n        <span class="edit input-xlarge uneditable-input"><%=show.title%></span>\r\n    </div>\r\n    <div>\r\n        <p class="field"><%=episode.description%></p>\r\n        <input class="edit" type="text" name="description" value="<%=episode.description%>" placeholder="Description" />\r\n    </div>\r\n</div>\r\n<div class="edit form-actions">\r\n    <button class="save btn btn-primary" type="submit">Save</button>\r\n    <button class="cancel btn" type="button">cancel</button>\r\n</div>'}),define("Episode/Views/Item",["backbone","underscore","text!Episode/Templates/Item.html"],function(e,t,n){return e.View.extend({className:"episode-view",template:t.template(n),events:{"dblclick .field":"edit","click button.save":"save","click button.cancel":"edit"},initialize:function(e){var t=this;e||(e={}),this.model=e.model,this.collection=e.collection||this.model.collection,this.model&&(this.listenTo(this.model,"change",this.render),this.listenTo(this.collection.show,"change:title",this.render),this.listenTo(this.model,"remove",this.episodeRoot),this.listenTo(this.collection.show,"remove",this.root)),this.initializeLock()},initializeLock:function(){var e=this;this.model&&this.listenTo(this,"remove",function(){this.model.unlock(),$(window).off("unload")}),$(window).on("unload",function(){e.model.unlock({async:!1}),$(window).off("unload")})},render:function(){return this.$el.html(this.template({episode:this.model.toJSON(),show:this.collection.show.toJSON()})),this.model.isNew()&&this.$el.addClass("editing"),this},remove:function(){this.trigger("remove"),e.View.prototype.remove.call(this)},root:function(){window.location.hash="shows"},episodeRoot:function(){window.location.hash="shows/"+this.collection.show.get("_id")+"/episodes"},edit:function(){this.model.isNew()&&this.episodeRoot();if(!this.$el.hasClass("editing")&&this.model.get("lock")===!0)return!1;this.$el.hasClass("editing")?(this.$el.removeClass("editing"),this.model.unlock()):(this.$el.addClass("editing"),this.model.lock())},save:function(e){e.stopPropagation(),e.preventDefault(),this.model.set({title:this.$el.find("input[name=title]").val(),description:this.$el.find("input[name=description]").val(),show:this.collection.show,lock:!1}),this.edit(),this.model.isNew()?this.collection.create(this.model,{wait:!0}):this.model.save()}})});
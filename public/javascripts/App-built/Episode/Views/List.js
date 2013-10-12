define("text!Episode/Templates/List.html",[],function(){return'<ul class="breadcrumb">\r\n  <li><a href="#shows">Shows</a> <span class="divider">/</span></li>\r\n  <li><a href="#shows/<%=show._id%>"><%=show.title%></a> <span class="divider">/</span></li>\r\n  <li class="active">Episodes</li>\r\n</ul>\r\n<a href="#shows/<%=show._id%>/episodes/new" class="pull-right btn btn-success">Create Episode</a>\r\n\r\n<table class="table table-striped">\r\n    <thead>\r\n        <tr>\r\n            <th>Title</th>\r\n            <th>Description</th>\r\n            <th></th>\r\n            <th></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody class="models">\r\n    </tbody>\r\n</table>'}),define("text!Episode/Templates/ListItem.html",[],function(){return'<td><%=episode.title%></td>\r\n<td><%=episode.description%></td>\r\n<td><a href="#shows/<%=show._id%>/episodes/<%=episode._id%>" class="btn btn-small">View</a></td>\r\n<% if(episode.lock) {%>\r\n<td><a class="btn btn-small btn-danger">LOCKED</a></td>\r\n<%} else {%>\r\n<td><a class="remove btn btn-small btn-danger">Delete</a></td>\r\n<%}%>\r\n            '}),define("Episode/Views/ListItem",["backbone","underscore","text!Episode/Templates/ListItem.html"],function(e,t,n){return e.View.extend({tagName:"tr",template:t.template(n),events:{"click a.remove":"destroy"},initialize:function(e){e||(e={}),this.model=e.model,this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"destroy",this.clearLine),this.listenTo(this.model,"remove",this.clearLine),this.listenTo(this.model.collection.show,"remove",this.root)},root:function(){window.location.hash="shows"},render:function(){return this.$el.html(this.template({episode:this.model.toJSON(),show:this.model.collection.show.toJSON()})),this},destroy:function(e){e.stopPropagation(),e.preventDefault(),confirm("Are you sure you want to delete this item")&&this.model.destroy()},clearLine:function(){this.$el.remove()}})}),define("Episode/Views/List",["backbone","underscore","text!Episode/Templates/List.html","Episode/Views/ListItem"],function(e,t,n,r){return e.View.extend({className:"episode-list",template:t.template(n),initialize:function(e){e||(e={}),this.collection=e.collection,this.listenTo(this.collection,"add",this.addOne),this.listenTo(this.collection.show,"change:title",this.render),this.listenTo(this.collection.show,"remove",this.root)},render:function(){return this.$el.html(this.template({show:this.collection.show.toJSON()})),this.addAll(),this},root:function(){window.location.hash="shows"},addAll:function(){this.$el.find(".models").children().remove(),this.collection.each(this.addOne,this)},addOne:function(e){var t=new r({model:e});this.$el.find(".models").append(t.render().el)}})});
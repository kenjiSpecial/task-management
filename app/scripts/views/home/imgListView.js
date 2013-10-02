define([
	'backbone',

	'parse/collection/projectCollection',

	'text!../../../templates/home/imgListTemplate.html'

], function( Backbone, projectCollection, imgListTemplate ){
	// 
	var imgListView = Backbone.View.extend({
		el         : $("#home-imgList"),
		
		initialize : function(){

		},

		render     : function(){
			var projectModelCollectionJson = projectCollection.getJson();
			
			//var compiled = _.template( imgListTemplate,  { collection: projectModelCollectionJson });
            //this.$el.html(compiled);
		},

		show       : function( ){
			
			if(this.$el.css('display') == 'none'){
				this.$el.show();
			}

		},

		hide       : function( ){
			var elDisplay = this.$el.css('display');
			if( elDisplay == 'block' || elDisplay == 'inline' ){
				this.$el.hide();
			}

		}		

	});

	return imgListView;

});
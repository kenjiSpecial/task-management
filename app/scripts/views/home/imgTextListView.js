define([
	'backbone',

	'collection/projectModelCollection',

	'text!../../../templates/home/listTextTemplate.html'

], function( Backbone, projectModelCollection, listTextTemplate ){
	//id: home-imgTextList / imgTextListView.js / listTextTemplate.html 
	var imgTextListView = Backbone.View.extend({
		el         : $("#home-imgTextList"),
		
		initialize : function(){

		},

		render     : function(){
			var projectModelCollectionJson = projectModelCollection.toJSON();
			
			var compiled = _.template( listTextTemplate,  { collection: projectModelCollectionJson });
            this.$el.html( compiled );
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

	return imgTextListView;

});
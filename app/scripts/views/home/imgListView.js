define([
	'backbone',

	'parse/collection/projectCollection',

    'helper/events',

	'text!../../../templates/home/imgListTemplate.html'

], function( Backbone, projectCollection, myEvents, imgListTemplate ){

	var imgListView = Backbone.View.extend({
		el         : $("#home-imgList"),

        events: {
            "click .btn-timer-start": "timerStartHandler"
        },
		
		initialize : function(){

		},

        timerStartHandler : function(e){

            var projectId = $(e.target).attr("project-id");

            myEvents.trigger('timerStart', projectId);

            e.preventDefault();
        },

		render     : function(){
			var projectModelCollectionJson = projectCollection.getJson();

			var compiled = _.template( imgListTemplate,  { collection: projectModelCollectionJson });
            this.$el.html(compiled);
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
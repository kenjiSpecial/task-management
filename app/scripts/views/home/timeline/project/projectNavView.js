define([
    'backbone',

    'models/userModel',
    'collection/projectModelCollection',

    'helper/events',

    'text!../../../../../templates/home/timeline/project/navTemplate.html'

], function ( Backbone, userModel, projectModelCollection, myEvents, navTemplate ) {
	var ProjectNavView = Backbone.View.extend({

		el     : null,

		events : {
			"click .next"       : "nextProject" ,
            "click .previous"   : "previousProject"
		},

		initialize      : function() {

			this.$el = $("#timeline-list-nav");
			userModel.on( 'change:currentPage', _.bind( this.userModelCurrentPageChanged, this ) );
			
		},

		render          : function() {

			this.$el.html(navTemplate);

			this.$previous = $(' .previous ');
			this.$next     = $(' .next ');

			this.userModelCurrentPageChanged();

		},

		nextProject     : function( event ) {

			var currentNumber = userModel.get('currentPage');
			userModel.set( 'currentPage', currentNumber + 1);

			event.preventDefault();
		},

		previousProject : function( event ) {
			
			var currentNumber = userModel.get('currentPage');
			userModel.set( 'currentPage', currentNumber - 1);

			event.preventDefault();
		},

		userModelCurrentPageChanged : function(){

			var currentNumber = userModel.get('currentPage');

			if ( currentNumber <= 0 ) { 
				
				if( ! this.$previous.hasClass('hidden') ) 	this.$previous.addClass('hidden'); 

			} else {

				if( this.$previous.hasClass('hidden') ) 	this.$previous.removeClass('hidden');

			}
			
			
			if(currentNumber >= projectModelCollection.length - 1){
				
				if( ! this.$next.hasClass('hidden') ) 	this.$next.addClass('hidden');

			} else {
				
				if( this.$next.hasClass('hidden') ) 	this.$next.removeClass('hidden');

			}
		}
	});

	return ProjectNavView
});
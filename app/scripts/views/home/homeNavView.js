define([

	'backbone',

	'helper/events'

], function( Backbone, myEvents ){

	var HomeNavView = Backbone.View.extend({
		el         : '#home-nav' ,

		initialize : function(){
			this.$el.css('display', 'none');
			this.$list_view = $( '#list-view' );
			this.$list_img  = $( '#list-img'  );
			this.$time_line = $( '#time-line' );

			myEvents.on(  'showHome', _.bind( this.showHome, this ) );
			myEvents.off( 'hideHome', _.bind( this.hideHome, this ) );
		},

		showHome   : function ( message ) {
			this.$el.css( 'display', 'block' );

			this.$time_line.removeClass('active') ;
			this.$list_img.removeClass('active') ;
			this.$list_view.removeClass('active') ;

			switch(message){
				case 'timeline' :
					this.$time_line.addClass('active') ;
					break;

				case 'list_img' :
					this.$list_img.addClass('active') ;
					break;

				case 'list_text' :
					this.$list_view.addClass('active') ;
					break;
			}

		},

		hideHome   : function ( ) {
			this.$el.hide();
		}



	});

	var homeNav = new HomeNavView();
	return homeNav;

})
define([

	'backbone',
	'collection/projectModelCollection',
	'models/userModel',
	'helper/events'

], function( Backbone, projectModelCollection, userModel, myEvent ){ 

	var LoadHelper = function(  ){
		this.loadCount = 2
		this.currentLoadCount = 0;
		this.loadStatus = false; 
	}

	LoadHelper.prototype.fetch = function(){
		// start to load the projectModelCollection
		$.when( projectModelCollection.fetch() ).done(
			_.bind( this.loadDone, this )
		);

		// start to load the userModel
		$.when( userModel.fetch() ).done(
			_.bind( this.loadDone, this )
		);
	}

	LoadHelper.prototype.loadDone = function(){
		this.currentLoadCount += 1;


		if( this.currentLoadCount == this.loadCount){
			this.loadStatus = true;	
			myEvent.trigger( "openingLoadDone" );
			
		}
	}

	var loadHelper = new LoadHelper();

	return loadHelper;
} );
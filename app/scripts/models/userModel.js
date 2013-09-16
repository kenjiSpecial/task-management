define([
	'backbone'
], function( Backbone ){
	var UserModel = Backbone.Model.extend({
			url  : 'data/userData.json'
		});

	var userModel = new UserModel();
	window.userModel = userModel;
	
	return userModel;
});
define([
    'backbone',
], function( Backbone ) {
    var testModel = Backbone.Model.extend();

    var ProjectModelCollection = Backbone.Collection.extend({
        model : testModel,
        url   : 'data/mainSample.json'
    });

    var projectModelCollection = new ProjectModelCollection();

    return projectModelCollection;

});
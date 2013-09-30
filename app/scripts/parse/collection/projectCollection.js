define(
    [
        'underscore',
        'helper/events',
        'parse/object/project'

    ], function( _underscore, myEvent, Project){
    var ProjectCollection = Parse.Collection.extend({
        model : Project,
        fetchStatus: null,

        fetchStart : function(){
            var query = new Parse.Query(this.model);;
            query.equalTo("user", Parse.User.current());
            this.query = query;

            //myEvent.on("fetchDone", _.bind(this.fetchDone, this));
            var self = this;

            this.fetch(

                {
                    success: function(project){

                        self.fetchStatus = true;
                        myEvent.trigger("fetchDone");
                        self.consoleLog();

                    }
                }

            )
        },

        consoleLog : function(){
            //alert("projectCollection fetchDone");
            console.log(this.toJSON());
        },

        getJson : function(){
            return this.toJSON()
        }

    });


    var projectCollection = new ProjectCollection();
    return projectCollection;
});
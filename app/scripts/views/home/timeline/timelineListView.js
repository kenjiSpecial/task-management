define([

    'backbone',

    'views/home/timeline/project/projectContentView',
    'views/home/timeline/project/projectNavView',

    
    'helper/events',

    'text!../../../../templates/home/timeline/timelineListTemplate.html'

], function ( Backbone, ProjectContentView, ProjectNavView, myEvents, timelineListTemplate) {
    var timelineListView = Backbone.View.extend({
        
        el         : null, 

        initialize : function ( ) {

            this.$el      = $('#timeline-list-wrapper');

        },

        render     : function ( ) {
            this.$el.html( timelineListTemplate )

            

            var projectContentView = new ProjectContentView();
            var projectNavView     = new ProjectNavView();

            projectContentView.render(), projectNavView.render();

        },


    });

    return timelineListView;
});
define([
    'backbone',

    'views/home/timeline/timeView',
    'views/home/timeline/timelineListView',

    'views/home/homeNavView',

    'text!../../../templates/home/homeTemplate.html'
], function ( Backbone, TimeView, TimelineListView, homeNavView, homeTemplate ) {

    var MainView = Backbone.View.extend({

        el       : $('#home-content'),

        timeView : null,
        timelineListView: null,

        initialize: function () {

        },

        render: function () {

            this.$el.html( homeTemplate );

            /// crete timeview,
            this.timeView = new TimeView();
            this.timeView.render();

            this.timelineListView = new TimelineListView();
            this.timelineListView.render();

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

    return MainView;
});
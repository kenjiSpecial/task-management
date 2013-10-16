define([
    'jquery',
    'backbone',

    'parse/collection/projectCollection',

    'helper/events',

    'text!../../../templates/timer/timerViewTemplate.html'
], function ( $, Backbone, projectModelCollection, myEvent, timerViewTemplate ) {

    var TimerView = Backbone.View.extend({

        el       : $('#timer-wrapper'),

        initialize: function () {
            var compiled = _.template( timerViewTemplate );

            this.timerStatus = false;

            this.$el.html(compiled);

            this.timeIntervalLoop = _.bind(this.timeInterval, this);
        },

        start: function(query){
            this.timerStatus = true;
        },

        timeInterval : function(){

            if(this.timerStatus){
                setTimeout(this.timeIntervalLoop, 1000)
            }

        },

        stop : function(query){
            this.timerStatus = 0;
        }

    });

    var timerView = new TimerView();

    myEvent.on("timerStart", function( query ){

        timerView.start(query);

    });

    myEvent.on("timerEnd", function( query ){

    });

    return timerView;
});
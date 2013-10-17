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

            if(!this.timerStatus){

                this.timerStatus = true;

                this.query = query;
                this.projectModel = projectModelCollection.get( query );
                this.projectModelJson = this.projectModel.toJSON();

                this.$el.find(".project-name").html(this.projectModelJson.name);

                this.$el.addClass("active");

                this.count = 0;

                $("html, body").animate({ scrollTop: 0 });

                this.timeInterval();
            }

        },

        timeInterval : function(){

            this.count ++;
            var time;

            if(this.count < 60){

                if(this.count < 10){
                    time = "0:00 0" + this.count;
                }else{
                    time = "0:00 " + this.count;
                }

            }else{
                var tempMinute = parseInt(this.count / 60);
                var second     = this.count % 60;

                var minuteString;
                var secondString;

                if( second < 10){
                    secondString = "0" + second;
                } else {
                    secondString = second;
                }

                if(tempMinute < 60){
                    var tempHour = parseInt(tempMinute / 60);
                    var tempMin  = tempMinute % 60;

                    if(tempMin < 10){
                        minuteString = tempHour + ":0" + tempMin;
                    }else{
                        minuteString = tempHour + ":" + tempMin;
                    }


                }else if(tempMinute < 10){
                    minuteString = "0:0" + tempMinute;
                }else{
                    minuteString = "0:" + tempMinute;
                }

                time = minuteString + " " +secondString;

            }

            // html renewed
            this.$el.find("#current").html(time);


            if(this.timerStatus){
                setTimeout(this.timeIntervalLoop, 1000)
            }

        },

        stop : function(query){

            /**
            this.projectModel.save(did:
            );
             */

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
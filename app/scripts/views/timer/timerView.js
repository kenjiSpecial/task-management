define([
    'jquery',
    'backbone',

    'parse/collection/projectCollection',

    'helper/events',

    'text!../../../templates/timer/timerViewTemplate.html'
], function ( $, Backbone, projectModelCollection, myEvent, timerViewTemplate ) {

    var TimerView = Backbone.View.extend({

        events   : {
            "click .btn-timer-stop" : "stop"
        },

        el       : $('#timer-wrapper'),

        initialize: function () {
            var compiled = _.template( timerViewTemplate );

            this.timerStatus = false;

            this.$el.html(compiled);

            this.timeIntervalLoop = _.bind(this.timeInterval, this);
        },

        start: function(query){

            var today      = moment();
            var weekOfYear = moment().week();

            if(!this.timerStatus){

                this.timerStatus = true;

                this.query = query;
                this.projectModel = projectModelCollection.get( query );
                this.projectModelJson = this.projectModel.toJSON();

                this.$el.find(".project-name").html(this.projectModelJson.name);

                this.$el.addClass("active");

                this.count = 0;

                $("html, body").animate({ scrollTop: 0 });


                var didLogs = this.projectModel.get("did");
                var sumHours     = 0;
                var sumWeekHours = 0;
                var todayHours   = 0;


                for( var i = 0; i < didLogs.length; i++ ){
                    sumHours += didLogs[i].hours;

                    var projectDate       = moment(didLogs[i].date);
                    var projectWeekOfYear = projectDate.week();
                    var differenceFromNow = today.diff(projectDate, 'days');


                    if(weekOfYear == projectWeekOfYear){
                        sumWeekHours += didLogs[i].hours;
                    }

                    // -------------------------

                    if(differenceFromNow == 0){
                        todayHours += didLogs[i].hours;
                    }

                }
                this.$el.find("#current").html("0:00 00");
                this.$el.find("#today").html( this.parseTimeHandler( todayHours ) );
                this.$el.find("#week-task").html( this.parseTimeHandler( sumWeekHours ) );
                this.$el.find("#total-task-hours").html( this.parseTimeHandler( sumHours ) );


                this.timerIntervalHandler = setInterval(this.timeIntervalLoop, 1000);
            }

        },

        parseTimeHandler : function( seconds ){
            var timeString;

            if( seconds < 60 ){

                if( seconds < 10){
                    timeString = "0:00 0" + seconds;
                }else{
                    timeString = "0:00 " + seconds;
                }

            }else{
                var tempMinute = parseInt( seconds / 60);
                var second     = seconds % 60;

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

                timeString = minuteString + " " +secondString;

            }

            return timeString;
        },

        timeInterval : function(){

            this.count++;
            console.log(this.count);
            var time;

            time = this.parseTimeHandler(this.count);

            // html renewed
            this.$el.find("#current").html(time);

        },

        stop : function(e){
            clearTimeout(this.timerIntervalHandler);

            var didPastLogs  = this.projectModel.get("did");

            var countTime = this.count;
            var today     = moment().format("L");
            var didLog    = {date: today, hours: countTime};

            var didLogs = [];

            if(didPastLogs){

                for(var i = 0; i < didPastLogs.length; i++){
                    didLogs.push(didPastLogs[i]);
                }

                didLogs.push(didLog);

            }else{
                didLogs.push(didLog);
            }

            this.projectModel.save({
                did : didLogs
            }, {
                success: function (myProject) {
                    // Execute any logic that should take place after the object is saved.
                    //alert('New object created with objectId: ' + myProject.id);
                    alert("save");

                },
                error: function (myProject, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    alert('Failed to create new object, with error code: ' + error.description);
                }
            });

            //console.log(didHours);

            e.preventDefault()
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
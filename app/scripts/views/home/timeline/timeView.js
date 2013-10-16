define([
    
    'backbone',
    'd3',
    'momentJS',
    'helper/events',
    'parse/collection/projectCollection',

], function ( Backbone, _d3, _momentJS, myEvents, projectCollection ) {
    var month_days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 , 31 ];

    var TimeView = Backbone.View.extend({

        el: $('#time-line-wrapper'),
        rects: [],

        initialize: function(){

            // userModel.on( 'change:currentPage', _.bind( this.userModelCurrentPageChanged, this ) );

        },

        render: function() {

            var i, j;
            var projectModel;
            var duration, startDateDays;
            var width , height = 400;
            var margin              = { left: 50, right: 50, top: 60, bottom: 10 };
            // var currentSelectNumber =  userModel.get("currentPage") ;


            // calculation of the width of the svg rectangle
            // the length should be one year
            var scheduleStartDate, scheduleEndDate, scheduleDuration;
            var windowWidth = $(window).width();

            var monthWidth = 100;

            var projectModelCollectionJson = projectCollection.getJson();

            for ( i = 0; i < projectModelCollectionJson.length; i++ ) {

                projectModel = projectModelCollectionJson[i];
                var projectStartDate = moment(projectModel.startDate);
                var projectEndDate   = moment(projectModel.endDate);


                var tempScheduleStartDate = moment(projectModel.startDate);
                var tempScheduleEndDate   = moment(projectModel.endDate);

                if( i == 0){

                    scheduleStartDate   = tempScheduleStartDate;
                    scheduleEndDate = tempScheduleEndDate;

                }else{
                    if ( scheduleStartDate.year() >= tempScheduleStartDate.year() ){

                        if ( scheduleStartDate.month() > tempScheduleStartDate.month() ){

                            scheduleStartDate = tempScheduleStartDate;

                        }
                    }

                    if ( scheduleEndDate.year() <= tempScheduleStartDate.year() ){

                        if ( scheduleEndDate.month() < tempScheduleStartDate.month() ){

                            scheduleEndDate = tempScheduleEndDate;

                        }
                    }
                }
            }

            // calculate the duration of the project.
            scheduleDuration = ( scheduleEndDate.year() - scheduleStartDate.year() ) * 365 + ( scheduleEndDate.week() - scheduleStartDate.week() ) * 7 + ( scheduleEndDate.day() - scheduleStartDate.day() );
            scheduleDuration /= 30;

            if(scheduleDuration < 12){
                width = 12 * monthWidth;

                if ( width < windowWidth ){

                    width      = windowWidth;
                    monthWidth = (width / 12)|0;

                }

                scheduleDuration = 12;
            }else{
                width = (scheduleDuration + 1)* monthWidth;

                if ( width < windowWidth ){

                    width      = windowWidth;
                    monthWidth = (width / scheduleDuration)|0;

                }
            }


            // created the svg
            var svg = d3.select( "#time-line-wrapper" ).append( "svg" )
                .attr( 'width' , width + margin.left + margin.right )
                .attr( 'height', height + margin.top + margin.bottom )
                .append( 'g' );

            // created rectangle


            var projectModelCollectionLength = projectModelCollectionJson.length;
            for ( i = 0; i < projectModelCollectionLength; i++ ) {

                var svgRect = svg.append("g");
                projectModel = projectModelCollectionJson[i];
                var projectStatus = projectModel.status;

                
                switch( projectStatus ){
                    
                    case 'schedule'   :
                        addNewRect(   projectModel, svgRect, margin, monthWidth, height, scheduleStartDate );
                        break;

                    case 'doing' : 
                        addDoingRect( projectModel, svgRect, margin, monthWidth, height, scheduleStartDate );
                        break;

                    case 'done'  :
                        addDoneRect(  projectModel, svgRect, margin, monthWidth, height, scheduleStartDate );
                        break;
                }

            }

            // add click event to every rect.
            this.$timeLine = $('.timeline_project');
            this.userModelCurrentPageChanged(projectModelCollectionJson.length - 1);
            this.$timeLine.click( function() {
                var $this = $(this);
            	var idNumber = parseInt($this.attr('id'));

                if(isNaN(idNumber)){

                    idNumber = $this.parent().attr('id');

                }

                userModel.set( 'currentPage', idNumber );
            });

            // create the x-axis
            // endDate -> startDate

            // drawing the line
            var timeLineAxis = svg.append("g");


            //mainLine.attr("transform", "translate(0," + (margin.top - 10) + ")");
            // width margint.left -> margin.left + width;
            var mainLine = timeLineAxis.append("line")
                .attr("x1", margin.left)
                .attr("y1", margin.top - 20)
                .attr("x2", margin.left + width)
                .attr("y2", margin.top - 20)
                .attr("stroke-width", 1)
                .attr("stroke", "rgb(150, 150, 150)");



            var lineHeight, lineWidth;
            var yearCount = 0;

            var scheduleStartMonthString;
            if( scheduleStartDate.month() < 9){
                scheduleStartMonthString =  '0' + String(scheduleStartDate.month() + 1);
            } else {
                scheduleStartMonthString =  String(scheduleStartDate.month() + 1);
            }

            timeLineAxis.append("text")
                .attr( "x", margin.left  - 24 )
                .attr( "y", margin.top  - 35)
                .text(  scheduleStartMonthString + ' / ' + scheduleStartDate.year() )
                .attr("class", "tl-first-text");


            for( i = 0; i <= scheduleDuration - 1; i++){
                if( (scheduleStartDate.month() + i) % 12 == 0){
                    lineHeight = 8;
                    lineWidth  = 2;
                    yearCount += 1;

                    timeLineAxis.append( "text" )
                        .attr( "x", margin.left + monthWidth * i - 18 )
                        .attr( "y", margin.top  - 35)
                        .text(  scheduleStartDate.year() + yearCount )
                        .attr("class", "tl-text");



                }else{
                    lineHeight = 5;
                    lineWidth  = 1;
                }
                var timelineRect = timeLineAxis.append("line")
                    .attr("x1", margin.left + monthWidth * i + 1)
                    .attr("y1", margin.top - 20)
                    .attr("x2", margin.left + monthWidth * i + 1)
                    .attr("y2", margin.top - lineHeight - 20)
                    .attr("stroke-width", lineWidth )
                    .attr("stroke", "rgb(150, 150, 150)") ;

            }

            timeLineAxis.append("line")
                .attr("x1", margin.left + width)
                .attr("y1", margin.top - 20)
                .attr("x2", margin.left + width)
                .attr("y2", margin.top - 25)
                .attr("stroke-width", 1)
                .attr("stroke", "rgb(150, 150, 150)") ;



        },

        userModelCurrentPageChanged: function(value){
            this.$timeLine.each( function(){

                    var class_attribute = $(this).attr('class');
                    if( class_attribute.indexOf( 'selected' ) > -1 ){
                        $( this ).attr( "class", "doing timeline_project");
                    }

            } );
            var id = projectCollection.at(value).id;
            console.log(id);

            var currentID = "#" + id;
            $( currentID ).attr('class', 'doing timeline_project selected');
        }

    });
    
    // draw the rectangles.

    function addNewRect(  projectModel, svgRect, margin, monthWidth, height, scheduleStartDate  ){
        // draw only schedule and done rect

        svgRect
            .attr('class', function(){
                return 'schedule timeline_project'
            })
            .attr( "id", function(){
                return projectModel.objectId;
            });

        var scheduleRect = svgRect.append('rect');

        scheduleRect
            .attr("class", function( ){
                return 'scheduleRect';
            })
            .attr("x", function(){
                var startDate = moment(projectModel.startDate);
                var x = margin.left + ( ( startDate.year() - scheduleStartDate.year() ) * 365 + ( startDate.week() - scheduleStartDate.week() ) * 7 + scheduleStartDate.day()  ) * monthWidth/30;
                return x;
            })
            .attr("y", function(){
                var type = projectModel.type;
                var marginTop;

                if(type == "main"){
                    marginTop = margin.top ;
                }else{
                    marginTop = margin.top + height * 0.7;
                }

                return marginTop;
            })
            .attr( "width", function(){
                var startDate = moment(projectModel.startDate);
                var endDate = moment(projectModel.endDate);

                var projectDuration = ( ( endDate.year() - startDate.year() ) * 365 + (endDate.week() - startDate.week()) * 7 + (endDate.day() - startDate.day()) ) * monthWidth/30;

                console.log("width: ", projectDuration);

                return projectDuration 
            }).
            attr('height', function(){
                var type = projectModel.type;
                var recHeight;

                if( type == "main" ){
                    recHeight = height * 0.5;
                }else{
                    recHeight = height * 0.2;
                }

                return recHeight;
            });


    }

    function addDoingRect( projectModel, svgRect, margin, monthWidth, height, scheduleStartDate ){
        // draw only schedule and done rect.

        svgRect
            .attr('class', function(){
                return 'doing timeline_project'
            })
            .attr( "id", function(){
                return projectModel.get( "id" );
            });

        var doingRect = svgRect.append("rect");

        doingRect
            .attr("class", function( ){
                return 'doingRect';
            })
            .attr("x", function(){
                var startDate = projectModel.get("schedule").start;
                var startDateDays = startDate.day;

                var x = margin.left + ( ( startDate.year - scheduleStartDate.year ) * 12 + ( startDate.month - scheduleStartDate.month ) + scheduleStartDate.day / month_days[ scheduleStartDate.month ] ) * monthWidth;

                return x;
            })
            .attr("y", function(){
                var type = projectModel.get( "type" );
                var marginTop;

                if(type == "main"){
                    marginTop = margin.top ;
                }else{
                    marginTop = margin.top + height * 0.7;
                }

                return marginTop;
            })
            .attr( "width", function(){
                var startDate = projectModel.get( "schedule" ).start;

                startDateDays = startDate.day;

                var endDate = projectModel.get( "schedule" ).end;
                var endDateDays = endDate.day;

                var projectDuration = ( ( endDate.year - startDate.year ) * 12 + endDate.month - startDate.month + (endDateDays - startDateDays)/ 30 ) * monthWidth;

                return projectDuration 
            }).
            attr('height', function(){
                var type = projectModel.get( "type" );
                var recHeight;

                if( type == "main" ){
                    recHeight = height * 0.5;
                }else{
                    recHeight = height * 0.2;
                }

                return recHeight;
            });

            // -------------------------------
            // -------------------------------


            var doneRect = svgRect.append("rect");

            doneRect
            .attr("class", function( ){
                return 'doneRect';
            })
            .attr("x", function(){
                var startDate = projectModel.get("done").start;
                var startDateDays = startDate.day;

                var x = margin.left + ( ( startDate.year - scheduleStartDate.year ) * 12 + ( startDate.month - scheduleStartDate.month ) + scheduleStartDate.day / month_days[ scheduleStartDate.month ] ) * monthWidth;

                return x;
            })
            .attr( "y", function(){
                var type = projectModel.get( "type" );
                var marginTop;

                if(type == "main"){
                    marginTop = margin.top ;
                }else{
                    marginTop = margin.top + height * 0.7;
                }

                return marginTop;
            })
            .attr( "width", function(){
                var startDate = projectModel.get( "done" ).start;

                startDateDays = startDate.day;

                var currentDate  = new Date();
                var currentYear  = currentDate.getFullYear();
                var currentMonth = currentDate.getMonth();
                var currentDay   = currentDate.getDate();


                var projectDuration = ( ( currentYear - startDate.year ) * 12 + currentMonth - startDate.month + ( currentDay - startDateDays)/ 30 ) * monthWidth;
                return projectDuration >> 0
            }).
            attr('height', function(){
                var type = projectModel.get( "type" );
                var recHeight;

                if( type == "main" ){
                    recHeight = height * 0.5;
                }else{
                    recHeight = height * 0.2;
                }

                return recHeight;
            });


    }

    function addDoneRect ( projectModel, svgRect, margin, monthWidth, height, scheduleStartDate ){
        // draw only done rect.
        svgRect
            .attr('class', function(){
                return 'done timeline_project'
            })
            .attr( "id", function(){
                return projectModel.get( "id" );
            });

        var doneRect = svgRect.append("rect");

        doneRect
            .attr("class", function(){
                return "doneRect"
            })
            .attr( "id" , function(){
                return projectModel.get( 'id' )
            } )
            .attr("x", function () {

                var startDate = projectModel.get( "done" ).start;


                startDateDays = startDate.day;

                for ( j = 0; j< startDate.month; j++ ) {
                    startDateDays += month_days[ j ];
                }

                var x = margin.left + ( ( startDate.year - scheduleStartDate.year ) * 12 + ( startDate.month - scheduleStartDate.month ) + scheduleStartDate.day / month_days[ scheduleStartDate.month ]) * monthWidth;
                return x;

            })
            .attr( "y", function () {
                var type = projectModel.get( "type" );
                var marginTop;

                if(type == "main"){
                    marginTop = margin.top ;
                }else{
                    marginTop = margin.top + height * 0.7;
                }

                return marginTop;
            })
            .attr( "width", function(){
                var startDate = projectModel.get( "done" ).start;

                startDateDays = startDate.day;

                var endDate = projectModel.get( "done" ).end;
                var endDateDays = endDate.day;


                var projectDuration = ( ( endDate.year - startDate.year ) * 12 + endDate.month - startDate.month + (endDateDays - startDateDays)/ 30 ) * monthWidth;

                return projectDuration ;
            } )
            .attr( "height", function() {
                var type = projectModel.get( "type" );
                var recHeight;

                if( type == "main" ){
                    recHeight = height * 0.5;
                }else{
                    recHeight = height * 0.2;
                }

                return recHeight;
            } )

                        //_.bind( this.rectClick, this) );
    }



    return TimeView;
});
define([

    'jquery',
    'backbone',
    'momentJS',

    'parse/collection/projectCollection',
    'helper/events',
    'text!../../../templates/detail/detailViewTemplate.html',

    'jqueryBackStretch'

], function ( $, Backbone, momentJS, projectModelCollection, myEvent, detailViewTemplate, _jqueryBackStretch ) {

	var DetailView = Backbone.View.extend({
		el        : $('#detail-wrapper'),
		status    : false,
		events: {
		    "click #create-task":   "createTask",
            "click .back":  "backToHome"
		},

        listTemplate : _.template(''
                    +    '<li><div class="checkbox">'
                    +    '<label><input type="checkbox" value="">'
                    +    '<%= task %>'
                    +    '</label></div></li>'
                    +    ''),


		initialize : function ( ) {
			
		},

		view      : function ( ) {
			
		},

		show      : function ( query ) {
            this.projectModel = projectModelCollection.get( query );

            this.projectModel.on('change', _.bind(this.addNewTask, this));
            var projectModelJson = this.projectModel.toJSON();
			var compiled = _.template( detailViewTemplate,  { model: projectModelJson, contentId: query } );
            this.$el.html( compiled );

            if(projectModelJson.backgroundFileName == "null"){
                $("#detail-head").backstretch('images/null-bg.jpg');
            }else{
                $("#detail-head").backstretch('images/' + projectModelJson.backgroundFileName);
            }


            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }

            var oneSide = $("#second-content").width() - 30;


            var svg = d3.select( "#progress-chart" ).append( "svg" )
                .attr( 'width' , oneSide )
                .attr( 'height', 105 * 2 )
                .attr( 'class' , 'thumbnail')
                .append( 'g' );


            var scheduleHours = projectModelJson.hours.schedule;
            var doneHours     = projectModelJson.hours.done;


            if(!doneHours){
                doneHours = 0;
            }
            var piTheta       = doneHours / scheduleHours * 2 * Math.PI;

            var arc = d3.svg.arc()
                .innerRadius( 50 )
                .outerRadius( 100 )
                .startAngle( 0 ) //converting from degs to radians
                .endAngle( piTheta );  //just radians

            var centerPos = (oneSide / 2)|0;

            svg.append("path")
                .attr("d", arc)
                .attr('class', 'graph-circle')
                .attr("transform", "translate(" + centerPos + "," + 105 + ")")

            svg.append("text")
                .attr("x", (oneSide - 50 ) / 2 )
                .attr("y", 105)
                .text( doneHours + " / " + scheduleHours )
                .attr("fill", "#95a5a6");
		},

		hide      : function ( ) {
            this.projectModel.off();

            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
                this.$el.html( "" );
            }
		},

		createTask : function ( event ) {
            event.preventDefault();

            var $newTaskContent = $("#new-task-content");



            //-console.log(this.projectModel)


            var taskContent = $newTaskContent.val();

            if( taskContent ) {

                this.newTask = {
                    "name"  : taskContent,
                    "state" : "doing",
                    "start" : moment().format('l'),
                    "end"   : "null"
                };

                var currentTasks = [];
                var modelTasks = this.projectModel.get('tasks');

                if(modelTasks){

                    for(var i = 0; i < modelTasks.length ; i++ ){
                        currentTasks[ i ] = modelTasks[i];
                    }

                }
                currentTasks.push( this.newTask );


                this.projectModel.set('tasks', currentTasks );
                this.projectModel.save();


                $newTaskContent.val("");
            }

		},

        addNewTask : function ( ) {

            var newTask = this.listTemplate( { task: this.newTask.name });
            $('#task-list').append(newTask);

        },

        backToHome : function ( ) {
            this.$el.hide();
            myEvent.trigger('backToHome');
        }
	});

	return DetailView;

});
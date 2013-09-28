define([

    'jquery',
    'backbone',
    'collection/projectModelCollection',
    'helper/events',
    'text!../../../templates/detail/detailViewTemplate.html',

    'jqueryBackStretch'

], function ( $, Backbone, projectModelCollection, myEvent, detailViewTemplate, _jqueryBackStretch ) {

	var DetailView = Backbone.View.extend({
		el        : $('#detail-wrapper'),
		status    : false,
		events: {
		    "click .btn":   "createTask",
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
			
			window.projectModelCollection = projectModelCollection;

			this.projectModel = projectModelCollection.get(query);
            this.projectModel.on('change', _.bind(this.addNewTask, this));
            var projectModelJson = this.projectModel.toJSON();
			
			var compiled = _.template( detailViewTemplate,  { model: projectModelJson } );
            this.$el.html( compiled );

            $("#detail-head").backstretch('images/' + projectModelJson.thumbnail.small);

            var oneSide = $("#second-content").width() - 30;

            var svg = d3.select( "#progress-chart" ).append( "svg" )
		                .attr( 'width' , oneSide )
		                .attr( 'height', 105 * 2 )
		                .attr( 'class' , 'thumbnail')
		                .append( 'g' );


            var scheduleHours = projectModelJson.schedule.hours;
            var doneHours     = projectModelJson.done.hours;
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

		},

		createTask : function ( event ) {

			var $newTaskContent = $("#new-task-content");

			var taskContent = $newTaskContent.val();

			if( taskContent ) {
                console.log(this.projectModel.get('tasks'));
                window.projectModel = this.projectModel;


				var date = new Date();

				this.newTask = {
					"name"  : taskContent,
                    "state" : "going",
                    "start" : { "year": date.getFullYear(), "month":  date.getMonth() + 1, "day": date.getDate() },
                    "end"   : null
				};

                var currentTasks = [];
                var modelTasks = this.projectModel.get('tasks');

                for(var i = 0; i < modelTasks.length ; i++ ){
                    currentTasks[ i ] = modelTasks[i];
                }
                currentTasks.push( this.newTask );


				this.projectModel.set('tasks', currentTasks );


				$newTaskContent.val("");
			} 

            event.preventDefault();
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
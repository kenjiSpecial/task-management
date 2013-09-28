define([
    'backbone',
    'collection/projectModelCollection',
    'text!../../../templates/current/currentViewTemplate.html'

], function ( Backbone, projectModelCollection, CurrentViewTemplate ) {

    var currentView = Backbone.View.extend({

        el       : $('#current-container'),

        initialize: function () {
            this.showStatus = false;
        },

        render     : function () {
            this.projectModelCollectionJson = projectModelCollection.toJSON();

            this.currentProjects = [];
            var sum = 0;

            for(var i = 0; i < this.projectModelCollectionJson.length; i++){

                var project = this.projectModelCollectionJson[i];

                if( project.status == "doing" ) {
                    this.currentProjects.push(project);

                    if(project.type == "main"){
                        project.score = 3;
                    } else {
                        project.score = 2;
                    }

                    sum += project.score;
                }
            }


            var compiled = _.template( CurrentViewTemplate, { collection: this.currentProjects } );
            this.$el.html(compiled);

            this.$el.css("height", window.innerHeight - 52);


            if( this.currentProjects.length == 1 ) {

                this.$el.find(".current-project-container").addClass("container");
                this.$el.find(".current-project-row").addClass("row");

            }

        },

        show       : function( ){

            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }


            if(!this.showStatus){
                if( this.currentProjects.length == 1 ) {

                    var $currentProjectContainer = this.$el.find(".current-project-container");

                    var currentProjectContainerWidth = $currentProjectContainer.width();
                    var windowWid = window.innerWidth;
                    if(windowWid > currentProjectContainerWidth){
                        var cssLeft = (windowWid - currentProjectContainerWidth)/2;
                        $currentProjectContainer.css("left", cssLeft);

                    }

                }


                for(var i = 0; i < this.currentProjects.length; i++ ){

                    var currentProject = this.currentProjects[i];
                    var bgDir = currentProject.thumbnail.background;

                    if(bgDir){

                        var projectString = "#project-bg-" + i;
                        var imageDirectory = "images/" + currentProject.thumbnail.background;
                        $(projectString).backstretch(imageDirectory);

                    }
                }

                this.showStatus = true;
            }


        },

        hide       : function( ){
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }
        }

    });

    return currentView;
});
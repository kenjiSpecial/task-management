define([

    'backbone',

    'models/userModel',
    'collection/projectModelCollection',

    'helper/events',

    'text!../../../../../templates/home/timeline/project/contentTemplate.html'

], function ( Backbone, userModel, projectModelCollection, myEvents, contentTemplate) {

    var timelineListView = Backbone.View.extend({
        el        : null, 
        currentId : null,
        prevId    : null,
        $nextBt   : null,
        $prevBt   : null,

        events: {
            "click .btn"        : "clickTest" ,
        },

        initialize: function( ) {

            this.$el      = $('#timeline-list-container');
            


            this.projectLengh = projectModelCollection.length - 1;
            this.currentId    = userModel.get('currentPage');

            userModel.on( 'change:currentPage', _.bind( this.userModelCurrentPageChanged, this ) );

        },

        render: function(){

            var projectModel = projectModelCollection.get( this.currentId );
            var projectModelJson = projectModel.toJSON();

            var compiled = _.template( contentTemplate,  { model: projectModelJson });
            this.$el.html(compiled);

            this.$nextBt = $('.next');
            this.$prevBt = $('.prev');

            this.$nextBt.addClass('hidden');
        },


        clickTest: function(){
            console.log('The time line list view click');
        },

        userModelCurrentPageChanged : function(  ){
            var id = userModel.get('currentPage')

            // hiding the current view.

            var $currentSelector = $("#list_" + this.currentId );
            
            $currentSelector.hide(600, function(){
                $currentSelector.remove();
            });
            
            // ----------------

            this.currentId       = id;
            if( this.currentId == this.projectLengh ) this.$nextBt.addClass('hide');
            else                                      this.$nextBt.removeClass('hide');

            if( this.currentId == 0 )                 this.$prevBt.addClass('hide');
            else                                      this.$prevBt.removeClass('hide');

            // ---------------

            var projectModel     = projectModelCollection.get( this.currentId );
            var projectModelJson = projectModel.toJSON();
            var compiled         = _.template( contentTemplate,  { model: projectModelJson });
            
            this.$el.append( compiled );

            var $newSelector     = $("#list_" + this.currentId);
            $newSelector.css( 'display', 'none' );

            $newSelector.show(600);
    
        }

    });

    return timelineListView;
});
define([

    'backbone',

    'collection/projectModelCollection',

    'helper/events',

    'text!../../../../../templates/relationship/relationshipListSubTemplate.html'

], function ( Backbone , projectModelCollection, myEvents, relationshipListSubTemplate ) {

    var RelationshipListView = Backbone.View.extend({

        el         : $('#relationship-list'),

        events     : {
            "mouseenter li": "liMouseEnter",
            "mouseleave li": "liMouseLeave",
            "click li"     : "liClick"

        },

        initialize : function () {
            this.$el = $('#relationship-list');
        },

        render     : function () {

            var projectModelCollectionJson = projectModelCollection.toJSON();

            var compiled = _.template( relationshipListSubTemplate,  { collection: projectModelCollectionJson });

            this.$el.html(compiled);

        },

        show       : function () {

            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }

        },

        hide       : function () {
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }

        },

        liMouseEnter: function(e){
            var $currentTarget = $(e.currentTarget);

            $currentTarget.toggleClass('hover');
            console.log($currentTarget.attr("list-id"));
            myEvents.trigger("mouseEnter", $currentTarget.attr("list-id"));
        },

        liMouseLeave: function(e){

            var $currentTarget = $(e.currentTarget);

            $currentTarget.toggleClass('hover');

            myEvents.trigger("mouseLeave", $currentTarget.attr("list-id"));

        },

        liClick: function(e){
            var $currentTarget = $(e.currentTarget).parent().removeClass("col-md-offset-10").addClass("col-md-offset-8");


            window.element = this.$el;
            var $relationshipContent = this.$el.find(".relationshipContent");

            $relationshipContent.removeClass("none-vis").addClass("selected");

            //window.$relationContent.addClass("selected");
            // console.log($("div").filter("relationshipContent"));

        }

    });

    return RelationshipListView;
});
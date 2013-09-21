define([

    'backbone',
    'd3',
    'collection/projectModelCollection',

    'views/relationship/graph/relationshipGraphView',
    'views/relationship/list/listView',

    'text!../../../../templates/relationship/relationshipTemplate.html'

], function ( Backbone, _d3, projectModelCollection, RelationshipGraphView, RelationshipListView, relationshipTemplate ) {

    var RelationshipView = Backbone.View.extend({

        el         : $('#relationship-container'),

        initialize : function () {
            this.$el.html( relationshipTemplate );
            this.relationshipGraphView   = new RelationshipGraphView();
            this.relationshipListView = new RelationshipListView();
        },

        render     : function ( ) {
            this.relationshipGraphView.render();
            this.relationshipListView.render();
        },

        show      : function( ) {

            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }

        },

        hide       : function( ) {
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }

        }

    });

    return RelationshipView;
});
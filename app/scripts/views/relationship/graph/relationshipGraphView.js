define([
    'backbone',

    'views/relationship/graph/sub/relationshipListView',
    'views/relationship/graph/sub/relationshipD3View'



], function ( Backbone, RelationshipListView, RelationshipD3View ) {

    var RelationshipGraphView = Backbone.View.extend({

        el                   : $('#relationship-graph'),

        initialize  : function () {

            this.relationshipListView = new RelationshipListView();
            this.relationshipD3View   = new RelationshipD3View();
        },

        render      : function( ) {
            this.relationshipListView.render();
            this.relationshipD3View.render();
        },

        show        : function( ){

            if(this.$el.css('display') == 'none') {
                this.$el.show();
            }

        },

        hide        : function( ){
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }
        }

    });

    return RelationshipGraphView;
});
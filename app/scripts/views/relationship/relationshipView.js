define([

    'backbone',
    'd3',
    'collection/projectModelCollection',

    'views/relationship/sub/relationshipD3View',
    'views/relationship/sub/relationshipListView',

    'text!../../../templates/relationship/relationshipTemplate.html'

], function ( Backbone, _d3, projectModelCollection, RelationshipD3View, RelationshipListView, relationshipTemplate ) {

    var RelationshipView = Backbone.View.extend({

        el         : $('#relationship-container'),

        initialize : function () {
            this.$el.html( relationshipTemplate );
            this.relationshipD3View   = new RelationshipD3View();
            this.relationshipListView = new RelationshipListView();
        },

        render     : function ( ) {
            this.relationshipD3View.render();

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
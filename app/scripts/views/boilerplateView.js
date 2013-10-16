define([
    'backbone',

    'text!../../../templates/register/Template.html'
], function ( Backbone, Template ) {

    var MainView = Backbone.View.extend({

        el       : $('#timer-wrapper'),

        initialize: function () {

        },

        show       : function( ){




            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }


        },

        hide       : function( ){
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }
        }

    });

    return MainView;
});
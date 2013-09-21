define([

    'backbone'

], function ( Backbone ) {

    var ListView = Backbone.View.extend({

        el       : $('#register-container'),

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

    return ListView;
});
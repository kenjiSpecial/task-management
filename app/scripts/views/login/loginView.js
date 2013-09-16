define([

    'backbone',

    'helper/events'

], function ( Backbone, myEvent ) {

    var LoginView = Backbone.View.extend({

        el       : $('#login-wrapper'),
        events   : {
            "click #log-in-bt": "login"
        },

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
                this.$el.hide(600);
            }

        },

        login      : function( event ) {
            // log in to google
            myEvent.trigger('loginBtClick');

            event.preventDefault();
        }

    });

    return LoginView;
});
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
            //myEvent.trigger('loginBtClick');
            var userName     = this.$el.find("#user").val();
            var passWordName = this.$el.find("#password").val();
            var $self = this.$el;

            Parse.User.logIn(userName, passWordName, {
                success: function(user) {
                    alert("loginSuccess");
                    myEvent.trigger("loginSuccess");
                },

                error: function(user, error) {
                    $self.find(".error").html("Invalid username or password. Please try again.").show();
                }
            });

            event.preventDefault();
        }

    });

    return LoginView;
});
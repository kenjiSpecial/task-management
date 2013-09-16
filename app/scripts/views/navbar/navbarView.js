define([
    'backbone'

], function ( Backbone ) {

    var NavbarView = Backbone.View.extend({

        el       : $('#navbar-section'),

        events   : {
            "click li": 'liClick'
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
                this.$el.hide();
            }

        },

        liClick : function (event) {

            $( "li" ).each(function() {
                if( $(this).hasClass( "active" ) ) $(this).removeClass( "active" );

            });

            $(event.target.parentNode).addClass("active");

        }

    });

    return NavbarView;
});
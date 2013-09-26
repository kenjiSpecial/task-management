define([
    'backbone'

], function ( Backbone ) {

    var NavbarView = Backbone.View.extend({

        el       : $('#navbar-section'),

        events   : {
            "click li": 'liClick',
            "click .navbar-header": 'headerClick'
        },

        initialize: function () {

        },

        init : function( page ){
            //console.log("navbar:  " + page);
            switch ( page ) {
                case "home":
                    this.$el.find("#nav-home").addClass("active");
                    break;

                case "register":
                    this.$el.find("#nav-register").addClass("active");
                    break;

                case "current":
                    this.$el.find("#nav-current").addClass("active");
                    break;

                case "projectRelationship":
                    this.$el.find("#nav-relationship").addClass("active");
                    break;

            }
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

        },

        headerClick  : function(e){

            $( "li" ).each(function() {
                if( $(this).hasClass( "active" ) ) $(this).removeClass( "active" );

            });

            this.$el.find("#nav-home").addClass("active");
        }

    });

    return NavbarView;
});
/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },

        datePicker : ["jquery"],
        jqueryBackStretch : ["jquery"]
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        text: '../bower_components/requirejs-text/text',
        d3: '../bower_components/d3/d3',
        datePicker: '../bower_components/gl-date-picker/glDatePicker',
        jqueryBackStretch : '../bower_components/jquery-backstretch/jquery.backstretch'
    }
});

require([

    'backbone',

    'models/userModel',

    'collection/projectModelCollection',

    'views/navbar/navbarView',

    'views/login/loginView',

    'views/home/mainView',
    'views/home/imgListView',
    'views/home/imgTextListView',
    'views/home/homeNavView',

    'views/detail/detailView',

    'views/register/registerView',

    'views/relationship/relationshipView',

    'views/current/currentView',

    'helper/events',
    'helper/loadHelper'

    //'../bower_components/sass-bootstrap/assets/js/holder'

], function ( Backbone, userModel, projectModelCollection, NavbarView, LoginView, MainView, ImgListView, ImgTextListView, HomeNavView, DetailView, RegisterView, RelationshipView, CurrentView, myEvent, loadHelper ) {
    var loadStatuses     = [ 'notLoading', 'loading', 'loadDone' ];
    var loadState        = loadStatuses[ 0 ];

    /** -------------- **/
    /** view variables **/

    var navbarView       = new NavbarView();

    var loginView        = new LoginView();

    var mainView         = new MainView();
    var imgListView      = new ImgListView();
    var imgTextListView  = new ImgTextListView();

    var detailView       = new DetailView();

    var registerView     = new RegisterView();

    var relationshipView = new RelationshipView();

    var currentView      = new CurrentView();

    /** -------------- **/

    var prevPageStatus ;


    var homeViewState = false;

    // var CLIENT_ID = '76795648038-2c56fd0bff98dverpdprhbbjf8m5uflt.apps.googleusercontent.com';
    // var SCOPES = 'https://www.googleapis.com/auth/drive';

    var APP_ID = "7XMOsP7DvvTF3EbAaXj43FSZHAjv2Zl9YSz5N99b";
    var JS_KEY = "ja43CiuOaMm5hwCp0iPb7EXquKYbsTdK3Wfsj8qk";


    setTimeout(handleClientLoad, 10);

    /** login **/

    function handleClientLoad ( ) {

        /**
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
            handleAuthResult);
        */

        //loginStatus = true;
        init();


    }

    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            //loginStatus = true;
        } else {
            //loginStatus = false;
        }

        init();
    }

    myEvent.on("loginBtClick", function(){

//        gapi.auth.authorize(
//            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
//            handleAuthResult2);

    });

    function handleAuthResult2(authResult) {

        if (authResult && !authResult.error) {

            // loginStatus = true;

            loginView.hide();
            navbarView.show();
            appRouter.loginDone();

        }

    }


    var AppRouter = Backbone.Router.extend({
        routes: {
            'register'      : 'registerProject',
            'relationship'  : 'projectRelationship',
            'current'       : 'current',
            'home/:query'   : 'home',
            'detail/:query' : 'detail',
            // Default
            '*actions'      : 'defaultAction'
        },

        initialize: function( ){

            if(Parse.User.current()){
                myEvent.on( "openingLoadDone", _.bind( this.loadDone, this ));
            }

            myEvent.on( "backToHome", _.bind(this.backToHome, this) );

            this.routesHit = 0;
            //keep count of number of routes handled by your application
            Backbone.history.on('route', function() { this.routesHit++; }, this);

        },

        login: function(){
            navbarView.hide();
            loginView.show();
        },

        loginDone: function(){
            if( loadHelper.loadStatus ){
                this.loadDone();
            }else{

            }
        },

        loadDone: function( ) {

            imgTextListView.render();
            imgListView.render();
            mainView.render();
            relationshipView.render();
            currentView.render();


            navbarView.init( this.page );

            switch( this.page ){
                case 'home':

                    this.home( this.query );

                    break;

                case 'detail':

                    this.detail( );

                    break;

                case 'register':

                    this.registerProject();

                    break;

                case 'projectRelationship':

                    this.projectRelationship();

                    break;

                case "current":
                    this.current();
                    break;
            }
        },



        // function for routers

        registerProject: function(){
            this.page = 'register';

            if ( Parse.User.current()) {
                if( loadHelper.loadStatus ) {

                    registerView.show();

                    this.hideView();

                    prevPageStatus = 'register';
                }
            } else {
                this.login();
            }
        },

        projectRelationship: function(){

            this.page = "projectRelationship";

            if ( Parse.User.current()) {
                if( loadHelper.loadStatus ) {

                    relationshipView.show();

                    this.hideView();

                    prevPageStatus = 'projectRelationship';
                }
            } else {
                this.login();
            }


        },

        current: function(){

            this.page = "current";

            if( Parse.User.current() ){

                if(loadHelper.loadStatus){

                    currentView.show();

                    this.hideView();

                    prevPageStatus = "current";

                }

            }else{
                this.login();
            }

        },

        home: function(query){
            this.page = 'home';
            this.query = query;

            //console.log('loginStatus: '+ loginStatus + ", loadHelper.loadStatus: " + loadHelper.loadStatus);

            if(Parse.User.current()){
                if( loadHelper.loadStatus ){

                    switch (query){
                        case 'list_text':

                            myEvent.trigger('showHome', 'list_text' );

                            imgTextListView.show();
                            imgListView.hide();
                            mainView.hide();

                            break;

                        case 'list_img':

                            myEvent.trigger('showHome', 'list_img' );

                            imgTextListView.hide();
                            imgListView.show();
                            mainView.hide();

                            break;

                        default:
                            myEvent.trigger('showHome', 'timeline' );

                            imgTextListView.hide();
                            imgListView.hide();
                            mainView.show();
                    }

                    this.hideView( );
                    prevPageStatus = 'home';
                }
            } else {

                this.login();

            }

        },

        detail        : function( query ) {

            this.page = 'detail';
            this.query = query;

            if(Parse.User.current()) {

                if( loadHelper.loadStatus ) {

                    detailView.show( query );

                    this.hideView();
                    prevPageStatus = 'home';
                }

            } else {
                this.login();
            }

        },

        defaultAction : function( ) {

            this.home();

        },

        hideView      : function ( ) {
            if( prevPageStatus && this.page != prevPageStatus ){
                switch( prevPageStatus ) {
                    case 'home':
                        mainView.hide();
                        imgListView.hide();
                        imgTextListView.hide();
                        HomeNavView.hideHome();
                        break;
                    case 'detail':
                        detailView.hide();
                        break;
                    case 'register':
                        registerView.hide();
                        break;
                    case 'projectRelationship':
                        relationshipView.hide();
                        break;
                    case 'current':
                        currentView.hide();
                        break;

                }
            }
        },

        backToHome    : function () {
            this.back();
        },

        back: function() {
            if( this.routesHit > 1 ) {
                //more than one route hit -> user did not land to current page directly
                window.history.back();
            } else {
                // otherwise go to the home page. Use replaceState if available so
                // the navigation doesn't create an extra history entry
                this.navigate('app/', {trigger:true, replace:true});
            }
        }

    });

    var appRouter;

    function init( ) {
        Parse.initialize("7XMOsP7DvvTF3EbAaXj43FSZHAjv2Zl9YSz5N99b", "ja43CiuOaMm5hwCp0iPb7EXquKYbsTdK3Wfsj8qk");
        appRouter = new AppRouter;
        Backbone.history.start();

        loadHelper.fetch();

    }

});

define([

    'backbone',

    'collection/projectModelCollection',

    'helper/events',

    'text!../../../../../templates/relationship/relationshipListSubTemplate.html',
    'text!../../../../../templates/relationship/relationshipDetailListTemplate.html'


], function ( Backbone , projectModelCollection, myEvents, relationshipListSubTemplate, relationshipDetailListTemplate ) {


    var RelationshipListView = Backbone.View.extend({

        el            : $('#relationship-list'),
        contentStatus : false,

        events     : {
            "mouseenter li": "liMouseEnter",
            "mouseleave li": "liMouseLeave",
            "click li"     : "liClick",

            "mouseenter button.btn-primary": "buttonMouseEnter",
            "mouseleave button.btn-primary": "buttonMouseLeave",

            "click button.btn-primary" : "switchList",

            "click .close": "closeArticle"

        },

        initialize : function () {
            this.$el = $('#relationship-list');
            myEvents.on("selectList", _.bind(this.d3SelectList, this));
        },

        render     : function () {

            this.projectModelCollectionJson = projectModelCollection.toJSON();

            var compiled = _.template( relationshipListSubTemplate,  { collection: this.projectModelCollectionJson });
            this.$el.html(compiled);

        },

        show       : function () {

            if(this.$el.css('display') == 'none'){
                this.$el.show();
            }

        },

        hide       : function () {
            var elDisplay = this.$el.css('display');
            if( elDisplay == 'block' || elDisplay == 'inline' ){
                this.$el.hide();
            }

        },

        liMouseEnter: function(e){
            var $currentTarget = $(e.currentTarget);

            $currentTarget.toggleClass('hover');
            // console.log($currentTarget.attr("list-id"));
            myEvents.trigger("mouseEnter", $currentTarget.attr("list-id"));
        },

        liMouseLeave: function(e){

            var $currentTarget = $(e.currentTarget);

            $currentTarget.toggleClass('hover');

            myEvents.trigger("mouseLeave", $currentTarget.attr("list-id"));

        },

        liClick: function(e){

            var $currentTarget = $(e.currentTarget);

            var $list = this.$el.find("li");
            for(var liNUm = 0; liNUm < $list.length; liNUm++){
                $list.removeClass("selected");
            }

            $currentTarget.addClass("selected");

            $currentTarget.parent().removeClass("col-md-offset-10").addClass("col-md-offset-7");

            var listIdNum = parseInt($currentTarget.attr("list-id"));

            var $relationshipContent = this.$el.find("#relationship-detail-contents");

            //$relationshipContent.removeClass("none-vis").addClass("selected");

            // ------

            var contentData      = this.projectModelCollectionJson[parseInt(listIdNum)];
            var relationshipData = [];
            var item = {};


            for( var i = 0; i < this.projectModelCollectionJson.length ; i++ ) {

                var relationships = this.projectModelCollectionJson[i].relationship;

                if ( relationships ) {
                    for( var j = 0; j < relationships.length; j++ ){

                        if(listIdNum == relationships[j]){

                            item = {id: i, name: this.projectModelCollectionJson[i].name };
                            relationshipData.push(item);

                        } else if(listIdNum == i) {
                            var number = relationships[j];
                            item = {id: number, name: this.projectModelCollectionJson[number].name };

                            relationshipData.push(item);
                        }

                    }
                }

            }

            //console.log(relationshipData);


            var compiled = _.template( relationshipDetailListTemplate,  { data: contentData, relationship: relationshipData } );
            //$("#relationship-detail-content").removeClass("invisible-content")
            if(this.contentStatus){

                $relationshipContent.html( compiled );
                //$("#relationship-detail-content").removeClass("invisible-content")
                this.$relationshipDetailContent = $("#relationship-detail-content");
                this.$relationshipDetailContent.removeClass("invisible-content").addClass("visible-content");
                this.$relationshipDetailContent.css("width", parseInt(window.innerWidth * 0.22) );

            }else{
                console.log(this.contentStatus);

                var $relationshipDetailContent = $("#relationship-detail-content");
                this.$relationshipDetailContent = $relationshipDetailContent;

                setTimeout(function(){
                    $relationshipContent.html( compiled );
                    console.log()
                    $("#relationship-detail-content").removeClass("invisible-content").addClass("visible-content");
                    $("#relationship-detail-content").css("width", parseInt(window.innerWidth * 0.22) );

                }, 500);

                this.contentStatus = true;
            }

            // -----------




        },

        /** button */

        buttonMouseEnter : function(e){
            var $currentTarget = $(e.currentTarget);
            myEvents.trigger("mouseEnter", $currentTarget.attr("id-num"));
        },

        buttonMouseLeave : function(e){
            var $currentTarget = $(e.currentTarget);
            myEvents.trigger("mouseLeave", $currentTarget.attr("id-num"));
        },

        closeArticle: function(e){
            var $list = this.$el.find("li");
            for(var liNUm = 0; liNUm < $list.length; liNUm++){
                $list.removeClass("selected");
            }

            this.$relationshipDetailContent.removeClass("visible-content").addClass("close-content");
            var $listGroup = this.$el.find(".list-group");
            $listGroup.removeClass("col-md-offset-7").addClass("col-md-offset-10");

            var $relationshipContent = this.$el.find("#relationship-detail-contents");
            this.$el.find("#relationship-detail-content").removeClass("visible-content").addClass("close-content");

            setTimeout(function(e){

                $relationshipContent.html("");

            }, 300);

            this.contentStatus = false;
        },

        switchList : function(e){
            var $relationshipContent = this.$el.find("#relationship-detail-contents");

            window.currentTarget = e;
            var $currentTarget = $(e.currentTarget);

            var $list = this.$el.find("li");
            for(var liNUm = 0; liNUm < $list.length; liNUm++){
                $list.removeClass("selected");
            }


            var listIdNum = parseInt($currentTarget.attr("id-num"));
            $($list[$list.length - listIdNum - 1]).addClass("selected");




            var contentData      = this.projectModelCollectionJson[parseInt(listIdNum)];
            var relationshipData = [];
            var item = {};



            for( var i = 0; i < this.projectModelCollectionJson.length ; i++ ) {

                var relationships = this.projectModelCollectionJson[i].relationship;

                if ( relationships ) {
                    for( var j = 0; j < relationships.length; j++ ){

                        if(listIdNum == relationships[j]){

                            item = {id: i, name: this.projectModelCollectionJson[i].name };
                            relationshipData.push(item);

                        } else if(listIdNum == i) {
                            var number = relationships[j];
                            item = {id: number, name: this.projectModelCollectionJson[number].name };

                            relationshipData.push(item);
                        }

                    }
                }



            }

            var compiled = _.template( relationshipDetailListTemplate,  { data: contentData, relationship: relationshipData } );

            $relationshipContent.html( compiled );
            //$("#relationship-detail-content").removeClass("invisible-content")
            this.$relationshipDetailContent = $("#relationship-detail-content");
            this.$relationshipDetailContent.removeClass("invisible-content").addClass("visible-content");
            this.$relationshipDetailContent.css("width", parseInt(window.innerWidth * 0.22) );


        },

        d3SelectList : function(number){
            //alert(number);

            var $list = this.$el.find("li");
            for(var liNUm = 0; liNUm < $list.length; liNUm++){
                $list.removeClass("selected");
            }

            var $currentTarget = $($list[$list.length - number - 1]);
            $currentTarget.addClass("selected");
            $currentTarget.parent().removeClass("col-md-offset-10").addClass("col-md-offset-7");

            var listIdNum = parseInt($currentTarget.attr("list-id"));



            var $relationshipContent = this.$el.find("#relationship-detail-contents");

            //$relationshipContent.removeClass("none-vis").addClass("selected");

            // ------

            var contentData      = this.projectModelCollectionJson[parseInt(listIdNum)];
            var relationshipData = [];
            var item = {};


            for( var i = 0; i < this.projectModelCollectionJson.length ; i++ ) {

                var relationships = this.projectModelCollectionJson[i].relationship;

                if ( relationships ) {
                    for( var j = 0; j < relationships.length; j++ ){

                        if(listIdNum == relationships[j]){

                            item = {id: i, name: this.projectModelCollectionJson[i].name };
                            relationshipData.push(item);

                        } else if(listIdNum == i) {
                            var number = relationships[j];
                            item = {id: number, name: this.projectModelCollectionJson[number].name };

                            relationshipData.push(item);
                        }

                    }
                }

            }

            //console.log(relationshipData);


            var compiled = _.template( relationshipDetailListTemplate,  { data: contentData, relationship: relationshipData } );
            //$("#relationship-detail-content").removeClass("invisible-content")
            if(this.contentStatus){

                $relationshipContent.html( compiled );
                //$("#relationship-detail-content").removeClass("invisible-content")
                this.$relationshipDetailContent = $("#relationship-detail-content");
                this.$relationshipDetailContent.removeClass("invisible-content").addClass("visible-content");
                this.$relationshipDetailContent.css("width", parseInt(window.innerWidth * 0.22) );

            }else{
                console.log(this.contentStatus);

                var $relationshipDetailContent = $("#relationship-detail-content");
                this.$relationshipDetailContent = $relationshipDetailContent;

                setTimeout(function(){
                    $relationshipContent.html( compiled );
                    console.log()
                    $("#relationship-detail-content").removeClass("invisible-content").addClass("visible-content");
                    $("#relationship-detail-content").css("width", parseInt(window.innerWidth * 0.22) );

                }, 500);

                this.contentStatus = true;
            }

        }

    });

    return RelationshipListView;


});
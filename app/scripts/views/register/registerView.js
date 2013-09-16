define([
    'backbone',

    'datePicker',

    'collection/projectModelCollection',

    'text!../../../templates/register/registerTemplate.html'
], function ( Backbone, datePicker, projectModelCollection, registerTemplate ) {

    var MainView = Backbone.View.extend({

        el       : $('#register-container'),

        events: {
            "change #thumbnailInputFile": "thumbnailFileChange",
            "change #backgroundInputFile":   "backgroundFileChange",
            "click #task-register" : "taskRegister"
        },

        initialize: function () {
            this.$el.html( registerTemplate );
            $('input#start-date').glDatePicker();
            $('input#end-date').glDatePicker();

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

        thumbnailFileChange : function ( event ) {
            //window.testevent = event;
            // event.target.value = ""; empty the file.
            var files = event.target.files;

            for(var i = 0; i < files.length; i ++){
                var file = files[i];

                if( !file.type.match('image.*') ) {
                    continue;
                }

                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {

                        var imgTag = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                        $("#thumbnailImg").html(imgTag);

                        // in the future php is here...

                    };
                })(file);

                reader.readAsDataURL(file);
            }


        },

        backgroundFileChange : function ( event ) {
            var files = event.target.files;

            for(var i = 0; i < files.length; i ++){
                var file = files[i];

                if( !file.type.match('image.*') ) {
                    continue;
                }

                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {

                        var imgTag = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                        $("#backgroundImg").html(imgTag);

                        // in the future php is here...

                    };
                })(file);

                reader.readAsDataURL(file);
            }
        },

        taskRegister : function ( event ){
            // check if the value is empty or not.
            var $inputNameText      = $("#inputName");
            var $formName           = $(".row-name");

            var $inputHourText      = $("#inputHour");
            var $formHour           = $(".row-hours");

            var $inputStartDateText = $("#start-date");
            var $formStartDate      = $(".row-start-hour");

            var $inputEndDateText   = $("#end-date");
            var $formEndDate        = $(".row-end-hour");

            var $inputBriefText     = $("#input-brief");
            var $formBrief          = $(".row-brief");

            var $inputContentText   = $("#input-content");
            var $formContent        = $(".row-content");


            var missedText    = false;
            var $errorUl      = $("#error-ul");

            $errorUl.html("");

            if( !$inputNameText.val() ) {
               $errorUl.append( "<li class='text-danger'>Project Name is missed</li>" );
               $formName.addClass("has-error");

               missedText = true;
            } else {
                if($formName.hasClass("has-error")) $formName.removeClass("has-error");
            }

            if( !$inputHourText.val() ) {
                $errorUl.append( "<li class='text-danger'>Hours is missed</li>" );
                $inputHourText.addClass("has-error");

                missedText = true;
            } else {
                if($formHour.hasClass("has-error")) $formHour.removeClass("has-error");
            }

            if( !$inputStartDateText.val() ) {
                $errorUl.append( "<li class='text-danger'>Start Date is missed</li>" );
                $formStartDate.addClass("has-error");

                missedText = true;
            } else {
                if($formStartDate.hasClass("has-error")) $formStartDate.removeClass("has-error");
            }

            if( !$inputEndDateText.val() ) {
                $errorUl.append( "<li class='text-danger'>End Date is missed</li>" );
                $formEndDate.addClass("has-error");

                missedText = true;
            } else {
                if($formEndDate.hasClass("has-error")) $formEndDate.removeClass("has-error");
            }

            if( !$inputBriefText.val() ) {
                $errorUl.append( "<li class='text-danger'>Brief text is missed</li>" );
                $formBrief.addClass("has-error");

                missedText = true;
            } else {
                if( $formBrief.hasClass("has-error") ) $formBrief.removeClass("has-error");
            }

            if( !$inputContentText.val() ) {
                $errorUl.append( "<li class='text-danger'>Content text is missed</li>" );
                $formContent.addClass("has-error");

                missedText = true;
            } else {
                if( $formContent.hasClass("has-error") ) $formContent.removeClass("has-error");
            }

            if( missedText ) {
                return;
            }

            // when all form is success




        }

    });

    return MainView;
});
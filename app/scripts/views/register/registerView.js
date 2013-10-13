define([
    'backbone',

    'datePicker',

    'collection/projectModelCollection',

    'text!../../../templates/register/registerTemplate.html',
    //'jqueryFileUpload'
], function (Backbone, datePicker, projectModelCollection, registerTemplate, _jqueryFileUpload) {

    var MainView = Backbone.View.extend({

        el: $('#register-container'),

        events: {
            "change #thumbnailInputFile" : "thumbnailFileChange",
            "change #backgroundInputFile": "backgroundFileChange",
            "click #register-project"    : "registerProject"
        },

        initialize: function () {
            this.$el.html(registerTemplate);
            $('input#start-date').glDatePicker();
            $('input#end-date').glDatePicker();

        },

        show: function () {

            this.thumbnailFile = null;
            this.backgroundFile = null;

            if (this.$el.css('display') == 'none') {
                this.$el.show();
            }

        },

        hide: function () {
            var elDisplay = this.$el.css('display');

            if (elDisplay == 'block' || elDisplay == 'inline') {
                this.$el.hide();
            }

        },

        thumbnailFileChange: function (event) {
            //window.testevent = event;
            // event.target.value = ""; empty the file.
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if (!file.type.match('image.*')) {
                    continue;
                }

                var thumbnailReader = new FileReader();

                thumbnailReader.onload = (function (theFile) {
                    return function (e) {

                        var imgTag = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                        $("#thumbnailImg").html(imgTag);

                        // in the future php is here...

                    };
                })(file);

                thumbnailReader.readAsDataURL(file);
                this.thumbnailFile = file
            }


        },

        backgroundFileChange: function (event) {
            var files = event.target.files;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if (!file.type.match('image.*')) {
                    continue;
                }

                var reader = new FileReader();

                reader.onload = (function (theFile) {
                    return function (e) {

                        var imgTag = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                        $("#backgroundImg").html(imgTag);

                        // in the future php is here...

                    };
                })(file);

                this.backgroundFile = file;
                reader.readAsDataURL(file);
            }
        },

        registerProject: function (event) {
            // check if the value is empty or not.
            var $inputNameText = $("#inputName");
            var inputNameText = $inputNameText.val();
            var $formName = $(".row-name");

            var typeValue = this.$el.find("#register-type").val();
            // console.log(typeValue);


            var $inputHourText = $("#inputHour");
            var inputHourText = $inputHourText.val();
            var $formHour = $(".row-hours");

            var $inputStartDateText = $("#start-date");
            var inputStartDateText = $inputStartDateText.val();
            var $formStartDate = $(".row-start-hour");

            var $inputEndDateText = $("#end-date");
            var inputEndDateText = $inputEndDateText.val();
            var $formEndDate = $(".row-end-hour");

            var $inputBriefText = $("#input-brief");
            var inputBriefText = $inputBriefText.val();
            var $formBrief = $(".row-brief");

            var $inputContentText = $("#input-content");
            var inputContentText = $inputContentText.val();
            var $formContent = $(".row-content");


            var thubmnailFileNameVal;
            if (this.thumbnailFile) {
                thubmnailFileNameVal = this.thumbnailFile.name;
            } else {
                thubmnailFileNameVal = "null"
            }


            var backgroundFileNameVal;
            if ( this.backgroundFile ) {
                backgroundFileNameVal = this.backgroundFile.name;
            } else {
                backgroundFileNameVal = "null";
            }

            // -------------------------------------

            var missedText = false;
            var $errorUl = $("#error-ul");

            // this.testSaveParse();

            $errorUl.html("");

            if (!inputNameText) {
                $errorUl.append("<li class='text-danger'>Project Name is missed</li>");
                $formName.addClass("has-error");

                missedText = true;
            } else {
                if ($formName.hasClass("has-error")) $formName.removeClass("has-error");
            }

            if (!inputHourText) {
                $errorUl.append("<li class='text-danger'>Hours is missed</li>");
                $inputHourText.addClass("has-error");

                missedText = true;
            } else {
                if ($formHour.hasClass("has-error")) $formHour.removeClass("has-error");
            }

            if (!inputStartDateText) {
                $errorUl.append("<li class='text-danger'>Start Date is missed</li>");
                $formStartDate.addClass("has-error");

                missedText = true;
            } else {
                if ($formStartDate.hasClass("has-error")) $formStartDate.removeClass("has-error");
            }

            if (!inputEndDateText) {
                $errorUl.append("<li class='text-danger'>End Date is missed</li>");
                $formEndDate.addClass("has-error");

                missedText = true;
            } else {
                if ($formEndDate.hasClass("has-error")) $formEndDate.removeClass("has-error");
            }

            if (!inputBriefText) {
                $errorUl.append("<li class='text-danger'>Brief text is missed</li>");
                $formBrief.addClass("has-error");

                missedText = true;
            } else {
                if ($formBrief.hasClass("has-error")) $formBrief.removeClass("has-error");
            }

            if (!inputContentText) {
                $errorUl.append("<li class='text-danger'>Content text is missed</li>");
                $formContent.addClass("has-error");

                missedText = true;
            } else {
                if ($formContent.hasClass("has-error")) $formContent.removeClass("has-error");
            }

            if (missedText) {
                return;
            }

            // when all form is success
            //var Project   = Parse.Object.extend("project");
            //var myProject = new Project();


            /**
             console.log( "name: " + inputNameText );
             console.log( "type: " + typeValue );
             console.log( "hour: " + inputHourText );
             console.log( "start date: " + inputStartDateText );
             console.log( "end date : " + inputEndDateText );
             console.log( "brief : " + inputBriefText );
             console.log( "content : " + inputContentText );
             */




            var Project = Parse.Object.extend("project");
            var myProject = new Project();


            myProject.save({
                name: inputNameText,
                thubmnailFileName : thubmnailFileNameVal,
                backgroundFileName : backgroundFileNameVal,
                type: typeValue,
                startDate: inputStartDateText,
                endDate: inputEndDateText,
                brief: inputBriefText,
                content: inputContentText,
                user: Parse.User.current(),
                status: "schedule",
                hours: { done: 0, schedule: parseInt(inputHourText) },
                ACL: new Parse.ACL(Parse.User.current())

            }, {
                success: function (myProject) {
                    // Execute any logic that should take place after the object is saved.
                    alert('New object created with objectId: ' + myProject.id);


                    $inputNameText.val("");
                    $inputHourText.val("");
                    $inputStartDateText.val("");
                    $inputEndDateText.val("");
                    $inputBriefText.val("");
                    $inputContentText.val("");
                },
                error: function (myProject, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and description.
                    alert('Failed to create new object, with error code: ' + error.description);
                }
            });


            // ------------------
            //  upload the file
            // ------------------


            this.imageUpload();

        },

        imageUpload: function () {
            var Formdata;
            var filenames = [];
            var updateData;

            /** thumbnailFile **/
            if (this.thumbnailFile) {
                if (!Formdata) {
                    Formdata = new FormData();
                }

                Formdata.append("images[]", this.thumbnailFile);

            }

            /** thumbnailFile **/
            if (this.backgroundFile) {
                if (!Formdata) {
                    Formdata = new FormData();
                }

                Formdata.append("images[]", this.backgroundFile);
            }

            updateData = { formData: Formdata, fileName: filenames };


            if ( Formdata ) {
                console.log(updateData);

                $.ajax({
                    url: "php/post-image.php",
                    type: "POST",
                    data: Formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        //alert("success" + res);
                        //document.getElementById("response").innerHTML = res;
                        var $errorUl = $("#error-ul");

                        if (!res) {
                            // upload success
                            alert("success");
                        } else {
                            $errorUl.append(res);
                        }
                        //console.log(res);
                    }
                });
            }



        }

    });

    return MainView;
});
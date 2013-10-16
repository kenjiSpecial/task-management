define([
    'jquery',
    'backbone',

    'parse/collection/projectCollection',

    'helper/events',

    'text!../../../templates/edit/editViewTemplate.html'
    ],

    function ( $, Backbone, projectModelCollection, myEvent, EditViewTemplate ) {
        var EditView = Backbone.View.extend({
            el           : $("#edit-wrapper"),
            projectModel : null,

            events: {
                "change #thumbnailInputFile" : "thumbnailFileChange",
                "change #backgroundInputFile": "backgroundFileChange",
                "click #edit-project"         : "editProject"
            },

            initialize: function(){
                this.$el.html(EditViewTemplate);
                $('input#edit-start-date').glDatePicker();
                $('input#edit-end-date').glDatePicker();
            },

            show       : function( query ){
                this.query = query;

                this.thumbnailFile = null;
                this.backgroundFile = null;

                this.projectModel = projectModelCollection.get( query );
                var projectModelJson = this.projectModel.toJSON();

                var projectName      = projectModelJson.name;
                var projectType      = projectModelJson.type;
                var projectHour      = projectModelJson.hour;
                var projectStartDate = projectModelJson.startDate;
                var projectEndDate   = projectModelJson.endDate;
                var projectBrief     = projectModelJson.brief;
                var projectContent   = projectModelJson.content;

                this.projectThumbnailFileName = projectModelJson.thubmnailFileName;
                this.projectBackgroundFileName = projectModelJson.backgroundFileName;

                this.$el.find('#inputNameEdit').val(projectName);
                this.$el.find("#edit-type").val(projectType);
                this.$el.find("#inputHour").val(projectHour);
                this.$el.find("#edit-start-date").val(projectStartDate);
                this.$el.find("#edit-end-date").val(projectEndDate);
                this.$el.find("#edit-input-brief").val(projectBrief);
                this.$el.find("#edit-input-content").val(projectContent);



                if( this.projectThumbnailFileName != "null"){

                    this.$el.find("#thumbnailImageTag").attr("src", "images/" + this.projectThumbnailFileName );

                }

                if( this.projectBackgroundFileName != "null"){

                    this.$el.find("#backgroundImageTag").attr("src", "images/" + this.projectBackgroundFileName );
                }


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

                this.projectThumbnailFileName = this.thumbnailFile.name;


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

                this.projectBackgroundFileName = this.backgroundFile.name;
            },

            editProject : function() {

                var self = this;

                var projectName = this.$el.find('#inputNameEdit').val();
                var projectType = this.$el.find("#edit-type").val();
                var projectHour = this.$el.find("#inputHour").val();
                var projectStartDate = this.$el.find("#edit-start-date").val();
                var projectEndDate = this.$el.find("#edit-end-date").val();
                var projectBrief = this.$el.find("#edit-input-brief").val();
                var projectContent = this.$el.find("#edit-input-content").val();
                var projectThubmnailFileName = this.projectThumbnailFileName;
                var projectBackgroundFileName = this.projectBackgroundFileName;

                this.parseUploadStatus = false;
                this.iamgeUploadStatus = false;

                /** save at parse **/
                this.projectModel.save({
                    name : projectName,
                    thubmnailFileName : projectThubmnailFileName,
                    backgroundFileName : projectBackgroundFileName,
                    type: projectType,
                    startDate: projectStartDate,
                    endDate: projectEndDate,
                    brief: projectBrief,
                    content: projectContent,
                    hours: { schedule: parseInt(projectHour) }
                }, {
                    success: function (myProject) {
                        // Execute any logic that should take place after the object is saved.
                        //alert('New object created with objectId: ' + myProject.id);
                        self.uploadParse();

                    },
                    error: function (myProject, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and description.
                        alert('Failed to create new object, with error code: ' + error.description);
                    }
                });


                /** upload the images **/
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
                                self.imageUploadSuccess();

                            } else {
                                $errorUl.append(res);
                            }
                            //console.log(res);
                        }
                    });
                }else{
                    this.iamgeUploadStatus = true;
                }


            },

            imageUploadSuccess : function(){
                this.iamgeUploadStatus = true;

                if(this.iamgeUploadStatus && this.parseUploadStatus){
                    // back

                    //window.app.navigate("detail/" + this.query, {trigger: true, replace: true});
                    myEvent.trigger('editToDetail', "detail/" + this.query);
                }
            },


            uploadParse : function(){
                this.parseUploadStatus = true;

                if(this.iamgeUploadStatus && this.parseUploadStatus){
                    // back

                    //window.app.navigate("detail/" + this.query, {trigger: true, replace: true});
                    myEvent.trigger('editToDetail', "detail/" + this.query);
                }
            }

        });


        return EditView;
    }
);
define([
    'backbone',

    'collection/projectModelCollection',

    'helper/events',

    'd3'
], function ( Backbone, projectModelCollection, myEvent, _d3) {

    var Relationship3DView = Backbone.View.extend({

        el         : $('#relationship-d3'),

        svg        : null,
        force      : null,

        nodes       : null,

        initialize : function () {
            myEvent.on("mouseEnter", _.bind(this.mouseEnter, this));
            myEvent.on("mouseLeave", _.bind(this.mouseLeave, this));


        },

        render     : function () {
            this.projectModelCollectionJson = projectModelCollection.toJSON();

            // svg rendering
            var width  = window.innerWidth;
            var height = window.innerHeight - 75;

            this.width  = width;
            this.height = height;


            this.svg   = d3.select("#relationship-d3").append('svg').attr( 'width', width ).attr( 'height', height );
            this.force = d3.layout.force().gravity(.01).charge(-300).linkDistance(200).size([width, height]).on("tick", _.bind(this.tick, this));
            this.drag  = this.force.drag().on( "dragstart", dragstartFunction);


            this.nodes = [];
            var links = [];

            for( var i = 0; i < this.projectModelCollectionJson.length; i++ ) {

                var tempNode = { x: width * Math.random(), y: height * Math.random(), fixStatus: false, name: this.projectModelCollectionJson[i].name, image: this.projectModelCollectionJson[i].thumbnail.small }
                this.nodes.push( tempNode );

                if(this.projectModelCollectionJson[i].relationship){
                    for( var j = 0; j < this.projectModelCollectionJson[i].relationship.length; j++ ) {

                        var tempLink = {"source": i, "target": this.projectModelCollectionJson[i].relationship[j] };

                        links.push(tempLink);

                    }
                }

            }

            this.force.nodes(this.nodes).links(links).start();

            var link = this.svg.selectAll(".link");
            var node = this.svg.selectAll(".node");

            this.link = link.data(links).enter().append("line").attr("class", "link");

            this.node = node.data(this.nodes).enter().append("g").attr("class", "node")
                                                                 .attr("id", function(d, i) { return "node-" + i; })
                                                                 .call(this.force.drag);


            var clipPath = this.node.append("clipPath")
                                    .attr( "id", function(d) { var dName = "cut-off-bottom" + d.name; return dName })


            clipPath.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 30);


            this.node.append("image")
                .attr("xlink:href", function(d){

                    console.log(d.image);

                    if(d.image == null){
                        return "images/null_small.jpg";
                    }else{
                        return "images/" + d.image;
                    }


                })
                .attr("x", -800/10 )
                .attr("y", -450/10 )
                .attr("width", 800/5)
                .attr("height", 450/5)
                .attr("clip-path", function(d){
                    var dName    = "cut-off-bottom" + d.name;
                    var dNameURL = "url(#" + dName + ")";
                    return dNameURL;
                });

            this.node.append("circle")
                .attr("cx",  0 )
                .attr("cy",  0 )
                .attr("r" , 30);



            this.node.append("text")
                .attr("dx", -20)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });


            function dragstartFunction( d ) {

                d.fixStatus = !d.fixStatus;
                d3.select(this).classed("fixed", d.fixStatus);

            }
        },


        tick      : function() {
            var winWidth  = this.width;
            var winHeight = this.height;

            this.link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            this.node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
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

        mouseEnter: function(msg){
            var winWd = window.innerWidth;
            var winHg = window.innerHeight;


            this.nodes.forEach(function(target) {
                if(target.index == msg){
                    //console.log("target is" + msg);

                    var select = "#node-" + msg;

                    var d3Select = d3.select( select );
                    d3Select.classed("selected", true);
                    //d3Select.transition().attr("transform", "translate(" + this.width/2 + "," + this.height/2  +")");
                    d3Select.selectAll("circle").transition().attr("r", 40);

                    // target.x = winWd / 2;
                    // target.y = winHg / 2;

                }else{
                    target.x += (Math.random() - .5) * 25;
                    target.y += (Math.random() - .5) * 25;
                }


            });

            this.force.resume();

        },

        mouseLeave : function(msg){
            this.nodes.forEach(function(target) {
                if(target.index == msg){
                    //console.log("target is" + msg);

                    var select = "#node-" + msg;

                    var d3Select = d3.select( select );

                    d3Select.classed("selected", false);
                    d3Select.selectAll("circle").transition().attr("r", 30);



                }
            });
        }

    });

    return Relationship3DView;
});
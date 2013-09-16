define([
    'backbone',

    'collection/projectModelCollection',

    'd3'
    //'text!../../../templates/register/Template.html'
], function ( Backbone, projectModelCollection /*, Template*/ ) {

    var Relationship3DView = Backbone.View.extend({

        el         : $('#relationship-list'),

        svg        : null,
        force      : null,

        initialize : function () {

        },

        render     : function () {
            this.projectModelCollectionJson = projectModelCollection.toJSON();

            // svg rendering
            var width  = window.innerWidth;
            var height = window.innerHeight - 75;


            this.svg   = d3.select("#relationship-container").append('svg').attr( 'width', width ).attr( 'height', height );
            this.force = d3.layout.force().gravity(.01).charge(-300).linkDistance(200).size([width, height]).on("tick", _.bind(this.tick, this));
            this.drag  = this.force.drag().on( "dragstart", dragstartFunction);

            console.log(this.projectModelCollectionJson);

            var nodes = [];
            var links = [];

            for( var i = 0; i < this.projectModelCollectionJson.length; i++ ) {

                var tempNode = { x: width * Math.random(), y: height * Math.random(), fixStatus: false, name: this.projectModelCollectionJson[i].name, image: this.projectModelCollectionJson[i].thumbnail.small }
                nodes.push( tempNode );

                if(this.projectModelCollectionJson[i].relationship){
                    for( var j = 0; j < this.projectModelCollectionJson[i].relationship.length; j++ ) {

                        var tempLink = {"source": i, "target": this.projectModelCollectionJson[i].relationship[j] };

                        links.push(tempLink);

                    }
                }

            }

            this.force.nodes(nodes).links(links).start();

            var link = this.svg.selectAll(".link");
            var node = this.svg.selectAll(".node");

            this.link = link.data(links).enter().append("line").attr("class", "link");
            this.node = node.data(nodes).enter().append("g").attr("class", "node").call(this.force.drag);


            var clipPath = this.node.append("clipPath").attr( "id", function(d) { var dName = "cut-off-bottom" + d.name; return dName } );
            clipPath.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 30);


            this.node.append("image")
                .attr("xlink:href", function(d){
                    return "images/" + d.image;;
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
            this.link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            this.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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

        }

    });

    return Relationship3DView;
});
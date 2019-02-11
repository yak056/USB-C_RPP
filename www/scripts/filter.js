var filter = {};
filter.pellicule = navigation.json;
filter.init = function(){
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered"){
            filter.createFilterNumbered(graph);
        }
        else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical"){
            filter.createFilterNamed(graph);
        }

    }
};

filter.createFilterNumbered = function(graph){

};
filter.createFilterNamed = function(graph){

};
$( function() {
    $( "#slider-range" ).slider({
        orientation: "horizontal",
        range: true,
        values: [ 17, 67 ],
        slide: function( event, ui ) {
            document.getElementById("minRangeSlider").innerText = ui.values[ 0 ] ;
            document.getElementById("maxRangeSlider").innerText = ui.values[ 1 ] ;
        }
    });
    document.getElementById("minRangeSlider").innerText = $( "#slider-range" ).slider( "values", 0 )  ;
    document.getElementById("maxRangeSlider").innerText = $( "#slider-range" ).slider( "values", 1 ) ;
} );
filter.init();
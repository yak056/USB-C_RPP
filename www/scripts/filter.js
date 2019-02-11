var filter = {};
filter.pellicule = navigation.json;
filter.init = function(){
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        print("hello + " + graph.bobo);
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered"){
            filter.createFilterNumbered(graph);
        }
        else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical"){
            filter.createFilterNamed(graph);
        }

    }
}

filter.createFilterNumbered = function(graph){

}
filter.createFilterNamed = function(graph){

}
$( function() {
    $( "#slider-range" ).slider({
        orientation: "horizontal",
        range: true,
        values: [ 17, 67 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
        " - $" + $( "#slider-range" ).slider( "values", 1 ) );
} );
print(filter.pellicule);
filter.init();
var rpp_connection = {};

rpp_connection.url = ""; // url of the R++ server for the first request
rpp_connection.urlImage = ""; // url where the graphs are stored
rpp_connection.pellicule = new struct.Pellicule();

rpp_connection.getUri = function(url){
    // get the list of graphs that are in the Pellicule of R++ (Computer)
    rpp_connection.url = url + ":7082/api/v1";
    rpp_connection.urlImage = url + ":7082";
    $.ajax({
        url : rpp_connection.url + "/graphs/list" ,
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            var list = code_html.list;
            rpp_connection.createGraph(list); // create the graph objects of the list from JSON
            navigation.createPellicule(); // Initialize the Pellicule with the given graphs
            navigation.changeDiv("home_view"); // Go to Home View
             },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};


rpp_connection.createGraph = function(list){
    // Create the graphs objects of the list
    for(var i=0; i<list.length; i++){
        var jsonGraph = list[i];
        var graph = struct.createGraph(
            jsonGraph.DfName,
            jsonGraph.ColId,
            rpp_connection.urlImage + jsonGraph.Uri,
            jsonGraph.ColName,
            null, null, null, null, null, null, null, null, null); // we get that with other requests
        rpp_connection.pellicule.list.push(graph); // add graphs to the pellicule
        rpp_connection.getType(graph); // get the type of graph and the last information
    }
};

rpp_connection.getType = function(graph){
    // ask the server for the graph's type
    $.ajax({
        url : rpp_connection.url + "/r/univariate/" + graph.dataFrame + "/" + graph.id + "/type",
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            rpp_connection.registerType(code_html.type, graph); // register the type and ask for the resume of the graph
        },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};

rpp_connection.registerType = function(type, graph){
    var newType = type.substring(3, type.length);
    graph.typeFilter = newType; // register the type
    rpp_connection.getResume(graph); // get the Resume of the graph
};

rpp_connection.getResume = function(graph) {
    // ask for the Resume of the graph
    $.ajax({
        url : rpp_connection.url + "/r/univariate/" + graph.dataFrame + "/" + graph.id + "/summary?maxmodalitycount=100"  ,
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            rpp_connection.registerResume(code_html.summary, graph) // register the Resume in the graph Object
        },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};

rpp_connection.registerResume = function(jsonResume, graph){
    /* Register the modalities and their count if the graph's type is nominal or logical. Else, just register mean,
    sd, min, 1Q, median, 3Q, max and NA.
     */
    if (graph.typeFilter == "nominal" || graph.typeFilter == "logical"){
        for(var i=0; i<jsonResume.length; i++){
            graph.listFilters.push(jsonResume[i].Label);
            graph.filterEffectives.push(parseInt(jsonResume[i].StrValue));
        }
    } else{
        graph.mean = parseFloat(jsonResume[0].StrValue);
        graph.sd = parseFloat(jsonResume[1].StrValue);
        graph.min = parseFloat(jsonResume[2].StrValue);
        graph.oneQ = parseFloat(jsonResume[3].StrValue);
        graph.median = parseFloat(jsonResume[4].StrValue);
        graph.threeQ = parseFloat(jsonResume[5].StrValue);
        graph.max = parseFloat(jsonResume[6].StrValue);
        graph.na = parseFloat(jsonResume[7].StrValue);
    }
};

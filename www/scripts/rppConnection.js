var rpp_connection = {};

rpp_connection.url = "";
rpp_connection.urlImage = "";
rpp_connection.pellicule = new struct.Pellicule();

rpp_connection.getUri = function(url){
    rpp_connection.url = url + ":7082/api/v1";
    rpp_connection.urlImage = url + ":7082";
    $.ajax({
        url : rpp_connection.url + "/graphs/list" ,
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            var list = code_html.list;
            rpp_connection.createGraph(list);
            console.log(rpp_connection.pellicule);
            navigation.createPellicule();
            navigation.changeDiv("home_view");
             },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};


rpp_connection.createGraph = function(list){

    for(var i=0; i<list.length; i++){
        var jsonGraph = list[i];
        var graph = struct.createGraph(
            jsonGraph.DfName,
            jsonGraph.ColId,
            rpp_connection.urlImage + jsonGraph.Uri,
            jsonGraph.ColName,
            null, null, null, null, null, null, null, null, null);
        rpp_connection.pellicule.list.push(graph);
        rpp_connection.getType(graph);
    }
};

rpp_connection.getType = function(graph){
    $.ajax({
        url : rpp_connection.url + "/r/univariate/" + graph.dataFrame + "/" + graph.id + "/type",
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            rpp_connection.registerType(code_html.type, graph);
        },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};

rpp_connection.registerType = function(type, graph){
    var newType = type.substring(3, type.length);
    graph.typeFilter = newType;
    rpp_connection.getResume(graph);
};

rpp_connection.getResume = function(graph) {
    $.ajax({
        url : rpp_connection.url + "/r/univariate/" + graph.dataFrame + "/" + graph.id + "/summary?maxmodalitycount=100"  ,
        type : 'GET',
        dataType : 'json',
        success : function(code_html, statut){
            rpp_connection.registerResume(code_html.summary, graph)
        },
        error : function(resultat, statut, erreur){
            console.log("error");
        }
    });
};

rpp_connection.registerResume = function(jsonResume, graph){
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

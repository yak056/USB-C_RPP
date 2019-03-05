var connection = {};
connection.url = null;

document.getElementById("connectButton").addEventListener("click", function(){
    connection.url = "http://" + document.getElementById("ipAddress").value + ":4040";
    console.log(connection.url);
    rpp_connection.getUri(connection.url.substring(0, connection.url.length - 5));
    //connection.sendHello();

    
});
connection.sendHello = function(){
    $.ajax({
        url : connection.url,
        type : 'POST', 
        dataType: "json",
        data : JSON.stringify({txt: "hello, I m the tablet"}),
        success : function(){
            console.log("good one");
            //rpp_connection.getUri(connection.url.substring(0, connection.url.length - 5));
            //connection.sendPost();
        },
        complete : function(){ 
            console.log("good two");

            //connection.sendPost();
        },
        error : function(){
            console.log("bad post")
        } 
     });
};

connection.sendPost = function(){
    $.ajax({
        url : connection.url,
        type : 'POST', 
        dataType: "json",
        data : JSON.stringify(connection.makeData()), 
        success : function(code_html, statut){ 
            console.log("good");// success est toujours en place, bien sûr ! 
        },
        error : function(resultat, statut, erreur){
            console.log("bad beat")
        } 
     });
};

connection.sendNewImage = function(img){
    $.ajax({
        url : connection.url,
        type : 'POST',
        dataType: "json",
        data : JSON.stringify({image : img}),
        success : function(code_html, statut){
            console.log("good");// success est toujours en place, bien sûr !
        },
        error : function(resultat, statut, erreur){
            console.log("bad beat")
        }
    });
}


connection.makeData = function(){
    var graph = navigation.pellicule.actual();
    var url = graph.uri;
    var jsonCanvas = JSON.stringify(graph.designCanvas);
    var height = graph.realHeight;
    var width = graph.realWidth;
    return {
        url : url,
        jsonCanvas : jsonCanvas,
        height : height,
        width : width,
        displayResume : (navigation.actualMainView == "BCC_img_resume"),
        resume : connection.getResumeData(graph)
    }
}

connection.getResumeData = function(graph){
    return (navigation.actualMainView == "BCC_img_resume") ? {
        min : graph.min,
        max : graph.max,
        mean : graph.mean,
        sd: graph.sd,
        oneQ : graph.oneQ,
        median: graph.median,
        threeQ: graph.threeQ,
        na: graph.na,
        typeFilter : graph.typeFilter,
        listFilters : graph.listFilters,
        filterEffectives : graph.filterEffectives
     } : null
    };
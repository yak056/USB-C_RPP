var resume = {};

resume.init = function(){
     // Initialize the Resume for the actual graph according to the type of data
    resume.graph = navigation.pellicule.actual();
    if (resume.graph.typeFilter == "numeric" || resume.graph.typeFilter == "integer" || resume.graph.typeFilter == "ordered") {
        resume.createResumeForNumber(resume.graph);
    } else if (resume.graph.typeFilter == "nominal" || resume.graph.typeFilter == "logical") {
        resume.createResumeForNominal(resume.graph);
    }
};

resume.createResumeForNumber = function(graph){
    // Display the resume for numeric, integer and ordered graphs : mean, sd, min, 1Q, median, 3Q, max and NA
    var table = document.getElementById("resume");
    table.innerHTML = "";
    table.innerHTML = "<tr><td id='mean'>mean</td><td>" + graph.mean + "</td></tr><tr><td id='sd'>sd</td><td>" + graph.sd +"</td></tr>"+
"<tr><td id='min'>min</td><td>" + graph.min + "</td></tr><tr><td id='oneQ'>1Q</td><td>" + graph.oneQ + "</td></tr>" +
"<tr><td id='median'>median</td><td>" + graph.median + "</td></tr><tr><td id='threeQ'>3Q</td><td>" + graph.threeQ + "</td></tr>"+
"<tr><td id='max'>max</td><td>" +graph.max + "</td></tr><tr><td id='na'>NA</td><td>" + graph.na + "</td></tr>";
};
resume.createResumeForNominal = function(graph){
    var table = document.getElementById("resume");
    table.innerHTML = "";
    for (var j = 0;  j < graph.filterEffectives.length; j++){
        table.innerHTML += "<tr><td>" + graph.listFilters[j] + "</td><td>" + graph.filterEffectives[j] + "</td></tr>";
    }
};

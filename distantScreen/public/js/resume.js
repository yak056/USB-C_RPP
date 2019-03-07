var resume = {};

resume.init = function () {
    // Initialize the resume according to the type of the data
    if (distantScreen.graph.resume.typeFilter == "numeric" || distantScreen.graph.resume.typeFilter == "integer" || distantScreen.graph.resume.typeFilter == "ordered") {
        resume.createResumeForNumber(distantScreen.graph.resume);
    } else if (distantScreen.graph.resume.typeFilter == "nominal" || distantScreen.graph.resume.typeFilter == "logical") {
        resume.createResumeForNominal(distantScreen.graph.resume);
    }
};

resume.createResumeForNumber = function (graph) {
    // Display the resume for numeric, integer and ordered graphs : mean, sd, min, 1Q, median, 3Q, max and NA
    var table = document.getElementById("resume");
    table.innerHTML = "";
    table.innerHTML = "<tr><td id='mean'>mean</td><td>" + graph.mean + "</td></tr><tr><td id='sd'>sd</td><td>" + graph.sd + "</td></tr>" +
        "<tr><td id='min'>min</td><td>" + graph.min + "</td></tr><tr><td id='oneQ'>1Q</td><td>" + graph.oneQ + "</td></tr>" +
        "<tr><td id='median'>median</td><td>" + graph.median + "</td></tr><tr><td id='threeQ'>3Q</td><td>" + graph.threeQ + "</td></tr>" +
        "<tr><td id='max'>max</td><td>" + graph.max + "</td></tr><tr><td id='na'>NA</td><td>" + graph.na + "</td></tr>";
};
resume.createResumeForNominal = function (graph) {
    // Display the resume for nominal and logical values. Get every modality and display their name and the number of occurrences
    var table = document.getElementById("resume");
    table.innerHTML = "";
    for (var j = 0; j < graph.filterEffectives.length; j++) {
        table.innerHTML += "<tr><td>" + graph.listFilters[j] + "</td><td>" + graph.filterEffectives[j] + "</td></tr>";
    }
};

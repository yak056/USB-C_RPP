var filter = {};
filter.pellicule = navigation.pellicule.list;  // get the data in the pellicule
filter.state = "unchanged";// get the state of the filters
filter.submitBtn = null;
filter.clearAllBtn = null;
filter.init = function () {
        /* Initialize the filters according to their type. Numeric, integer, ordered are displayed with range sliders
    but nominal and logical are displayed with checkboxes.
     */
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered") {
            filter.createDivSlider(graph);
        } else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
            filter.createFilterNamed(graph);
        }

    }
    filter.submitBtn = document.getElementById("submitButton");
    filter.submitBtn.addEventListener("click", filter.getValue); // retrieve the values that have changed
    $("#submitButton").prop('disabled', true); // Until a value changed, the button is disabled
    filter.clearAllBtn = document.getElementById("clearButton");
    filter.clearAllBtn.addEventListener("click", filter.clearAll); // Clear all filters after a click on clear All
    $("#clearButton").prop('disabled', true);// Until a value changed, the button is disabled
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
        filter.initCB(graph); // Initialize checkbox listeners
    }}
};

filter.createDivSlider = function (graph) {
        // Create the div for the range slider associated to the graph
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += " <div class=\"filterTitle\">\n" +
        "                                    <p>" + graph.name + "</p>\n" +
        "                                    <div class=\"rangeSlider\">\n" +
        "                                    <div class=\"col-xs-1 minRange\" id=\"minRangeSlider" + graph.id + "\" style=\"text-align: right\">\n" +
        "                                        t1\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-xs-10\">\n" +
        "                                        <div id=\"slider-range" + graph.id + "\"></div>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-xs-1 maxRange\" id=\"maxRangeSlider" + graph.id + "\" style=\"text-align: left\">\n" +
        "                                        t2\n" +
        "                                    </div>\n" +
        "                                    </div>\n" +
        "                                </div>";
    filter.createRangeSlider(graph.id, graph.min, graph.max);
};

filter.createCheckbox = function (graph) {
        // Creation of the checkboxes of the corresponding graph. Display the name and all of the modalities
    var innerHtml = "";
    for (var i = 0; i < graph.listFilters.length; i++) {
        innerHtml += "  <div class=\"form-check\" id=\"DivCheckBox" + graph.id + "_" + i + "\">\n" +
            "               <input type=\"checkbox\" id=\"CheckBox" + graph.id + "_" + i + "\">\n" +
            "               <label class=\"checkBoxLabel\" for=\"CheckBox" + graph.id + "_" + i + "\">" + graph.listFilters[i] + "</label>\n" +
            "               <span class=\"checkmark\"></span>\n" +
            "           </div>";

    }

    return innerHtml;
};

filter.initCB = function(graph){
        // Initialization of the checkbox listeners ( closure for JS)
    return function(graph){
        filter.initListenersChekbox(graph)
    }(graph);
};
filter.initListenersChekbox = function (graph) {
        // Initialization of the checkbox listeners. On click, change the state of the submit and clearAll buttons
    return function(graph){
    for (var i = 0; i < graph.listFilters.length; i++) {
        document.getElementById("CheckBox" + graph.id + "_" + i).addEventListener("click", function (e) {
            console.log("hange")
            $("#submitButton").prop('disabled', false);
            $("#clearButton").prop('disabled', false);
        });
    }
}(graph);
};
filter.createFilterNamed = function (graph) {
        // Create the div for the graph if it has checkboxes
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += "<div class=\"filterTitle\"><p>" + graph.name + "</p></div>";
    filterlist.innerHTML += filter.createCheckbox(graph);

};

filter.createRangeSlider = function (id, min, max) {
        /*Create the range slider for the graph id. The range slider allows to set the min and max. It is initialized
    by the min and max value of the graph.
     */
    var idRange = "#slider-range" + id;

    $(function () {
        $(idRange).slider({
            orientation: "horizontal",
            range: true,
            values: [min, max],
            min: min,
            max: max,
            step: (max - min) / 100,
            slide: function (event, ui) {
                document.getElementById("minRangeSlider" + id).innerText = ui.values[0];
                document.getElementById("maxRangeSlider" + id).innerText = ui.values[1];
                $("#submitButton").prop('disabled', false);
                $("#clearButton").prop('disabled', false);
            }
        });
        document.getElementById("minRangeSlider" + id).innerText = $(idRange).slider("values", 0);
        document.getElementById("maxRangeSlider" + id).innerText = $(idRange).slider("values", 1);
    });
};

$(function () {
    $("#slider-range0").slider({
        orientation: "horizontal",
        range: true,
        values: [0, 100],
        slide: function (event, ui) {
            document.getElementById("minRangeSlider0").innerText = ui.values[0];
            document.getElementById("maxRangeSlider0").innerText = ui.values[1];
            $("#submitButton").prop('disabled', false);
            $("#clearButton").prop('disabled', false);
        }
    });
    document.getElementById("minRangeSlider0").innerText = $("#slider-range0").slider("values", 0);
    document.getElementById("maxRangeSlider0").innerText = $("#slider-range0").slider("values", 1);
});

filter.getValue = function () {
        // get all the changed value from the range sliders and checkboxes to make a request to R++
    var res = {};
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered") {
            if (document.getElementById("minRangeSlider" + i).innerText != graph.min || document.getElementById("maxRangeSlider" + i).innerText != graph.max) {
                res[graph.name] = {};
                res[graph.name].min = document.getElementById("minRangeSlider" + i).innerText;
                res[graph.name].max = document.getElementById("maxRangeSlider" + i).innerText;
            }
        } else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
            for (var j = 0; j < graph.listFilters.length; j++) {
                if (document.getElementById("CheckBox" + i + "_" + j).checked) {
                    if (!res[graph.name]) res[graph.name] = [];
                    res[graph.name].push(graph.listFilters[j]);
                }
            }
        }
    }
    $("#submitButton").prop('disabled', true); // on a submit donc on cache le btn
    var keys = Object.keys(res);
    for(var i=0; i<keys.length; i++){
        if (keys[i] == "sexe"){
            navigation.changeJson(data_femme);
            break;
        }
        else if(keys[i] == "scoreTricheTotal"){
            navigation.changeJson(data_medianScoreTricheTotal);
            break;
        }
    }
    return res;
};

filter.clearAll = function () {
        // On clear All, all the range sliders and checkboxes are reset to their initial state.
    var filterlist = document.getElementById("filterList");
    filterlist.innerText = "";
    navigation.changeJson(data);
    filter.init();
};

filter.init();
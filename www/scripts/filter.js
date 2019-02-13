var filter = {};
filter.pellicule = navigation.pellicule.list;
filter.init = function(){
    for (var i = 0; i < filter.pellicule.length; i++) {
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered") {
            filter.createDivSlider(graph);
        } else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
            filter.createFilterNamed(graph);
        }

    }
    var submitBtn = document.getElementById("submitButton");
    submitBtn.addEventListener("click", filter.getValue);
};

filter.createDivSlider = function(graph){
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += " <div class=\"filterTitle\">\n" +
        "                                    <p>" + graph.name + "</p>\n" +
        "                                    <div class=\"rangeSlider\">\n" +
            "                                    <div class=\"col-xs-1 minRange\" id=\"minRangeSlider"+ graph.id + "\" style=\"text-align: right\">\n" +
            "                                        t1\n" +
            "                                    </div>\n" +
            "                                    <div class=\"col-xs-10\">\n" +
            "                                        <div id=\"slider-range" + graph.id + "\"></div>\n" +
            "                                    </div>\n" +
            "                                    <div class=\"col-xs-1 maxRange\" id=\"maxRangeSlider"+ graph.id + "\" style=\"text-align: left\">\n" +
            "                                        t2\n" +
            "                                    </div>\n" +
        "                                    </div>\n" +
        "                                </div>";
    filter.createRangeSlider(graph.id, graph.min, graph.max);
};

filter.createCheckbox  = function (graph){
    var innerHtml = "";
    for (var i=0; i<graph.listFilters.length; i++){
        innerHtml += "  <div class=\"form-check\" id=\"DivCheckBox" + graph.id + "_"+ i + "\">\n" +
            "               <input type=\"checkbox\" id=\"CheckBox" + graph.id + "_"+ i + "\">\n" +
            "               <label class=\"checkBoxLabel\" for=\"CheckBox" + graph.id + "_"+ i + "\">" + graph.listFilters[i] + "</label>\n" +
            "               <span class=\"checkmark\"></span>\n" +
            "           </div>";
    }
    return innerHtml;
};

filter.createFilterNamed = function(graph){
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += "<div class=\"filterTitle\"><p>" +  graph.name + "</p></div>";
    filterlist.innerHTML += filter.createCheckbox(graph);
};

filter.createRangeSlider = function(id, min, max) {
    var idRange = "#slider-range"+id;

    $( function () {
        $(idRange).slider({
            orientation: "horizontal",
            range: true,
            values: [min, max],
            min:min,
            max:max,
            step:(max-min)/100,
            slide: function (event, ui) {
                document.getElementById("minRangeSlider" + id).innerText = ui.values[0];
                document.getElementById("maxRangeSlider" + id).innerText = ui.values[1];
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
            }
        });
        document.getElementById("minRangeSlider0").innerText = $("#slider-range0").slider("values", 0);
        document.getElementById("maxRangeSlider0").innerText = $("#slider-range0").slider("values", 1);
});

filter.getValue = function(){
    var res = {};
    for (var i = 0; i < filter.pellicule.length; i++){
        var graph = filter.pellicule[i];
        if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered") {
            if (document.getElementById("minRangeSlider" + i).innerText != graph.min || document.getElementById("maxRangeSlider" + i).innerText != graph.max){
                res[graph.name] = {};
                res[graph.name].min = document.getElementById("minRangeSlider" + i).innerText;
                res[graph.name].max = document.getElementById("maxRangeSlider" + i).innerText;
            }
        }
        else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
            for (var j = 0; j < graph.listFilters.length; j++){
                if (document.getElementById("CheckBox" + i + "_" + j).checked){
                    if (!res[graph.name]) res[graph.name] = [];
                    res[graph.name].push(graph.listFilters[j]);
                }
            }
        }
    }
    print (res);
    return res;
};

filter.init();
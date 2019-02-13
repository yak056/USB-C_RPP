var filter = {};
filter.pellicule = navigation.pellicule.list;
filter.init = function(){
    for (var j=0; j<4; j++) {
        for (var i = 0; i < filter.pellicule.length; i++) {
            var graph = filter.pellicule[i];
            if (graph.typeFilter == "numeric" || graph.typeFilter == "integer" || graph.typeFilter == "ordered") {
                filter.createDivSlider(graph);
            } else if (graph.typeFilter == "nominal" || graph.typeFilter == "logical") {
                filter.createFilterNamed(graph);
            }

        }
    }
};

filter.createDivSlider = function(graph){
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += " <div>\n" +
        "                                    <p>" + graph.name + "</p>\n" +
        "                                    <div class=\"col-xs-1\" id=\"minRangeSlider"+ graph.id + "\" style=\"text-align: right\">\n" +
        "                                        t1\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-xs-10\">\n" +
        "                                        <div id=\"slider-range" + graph.id + "\"></div>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"col-xs-1\" id=\"maxRangeSlider"+ graph.id + "\" style=\"text-align: left\">\n" +
        "                                        t2\n" +
        "                                    </div>\n" +
        "                                </div>";
    filter.createRangeSlider(graph.id, graph.min, graph.max);
};

filter.createFilterNamed = function(graph){
    var filterlist = document.getElementById("filterList");
    filterlist.innerHTML += "<div>\n" +
        "                                    <p>\n" +
        "                                        My name 2\n" +
        "                                    </p>\n" +
        "                                    <div class=\"form-check\">\n" +
        "                                        <input type=\"radio\" value=\"\" id=\"defaultCheck3\">\n" +
        "                                        <label class=\"form-check-label\" for=\"defaultCheck3\">\n" +
        "                                            Default checkbox\n" +
        "                                        </label>\n" +
        "                                    </div>\n" +
        "                                    <div class=\"form-check\">\n" +
        "                                        <input class=\"form-check-input\" type=\"radio\" value=\"\" id=\"defaultCheck4\">\n" +
        "                                        <label class=\"form-check-label\" for=\"defaultCheck4\">\n" +
        "                                            Disabled checkbox\n" +
        "                                        </label>\n" +
        "                                    </div>\n" +
        "                                </div>";
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

filter.init();
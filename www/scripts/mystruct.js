var struct = {};
struct.createGraph = function (id, uri, name, typeFilter, min, max, mean, sd, oneQ, median, threeQ, na, filterEffectives, listFilter) {
        // Transform the data from R++ in a "graph" in the application
    var graph = {};
    graph.id = id;
    graph.name = name;
    graph.typeFilter = typeFilter; // numeric, ordered, ordered, nominal, logical
    graph.listFilters = listFilter;// list of the modalities if nominal or logical
    graph.min = min;
    graph.max = max;
    ////////////////////
    graph.mean = mean;
    graph.sd = sd;
    graph.oneQ = oneQ; // 1st quarter
    graph.median = median;
    graph.threeQ = threeQ; // 3rd quarter
    graph.na = na;
    graph.filterEffectives = filterEffectives; // count of the modalities
    /////////////////////////////
    /////////////////////////////
    graph.uri = uri;
    graph.fabricCanvas = null;
    graph.realHeight = null;
    graph.realWidth = null;
    graph.designCanvas = null;
    graph.vignetteCanvas = null; //the main canvas 
    graph.familyCanvas = []; //list of all the canvas for the graph except the one with annotation
    graph.drawingJson = []; // to save design shapes in a json 
    return graph;
};

struct.removeObjectsForVignette = function (graph, canvasDest) { // only for vignette in Pellicule
    var objects = canvasDest.getObjects();
    for (var i = 0; i < objects.length; i++) {
        canvasDest.remove(objects[i]);
        objects[i] = null;
    }
    canvasDest.renderAll();
    struct.duplicateAndResizeObjects(graph, canvasDest);
}
struct.duplicateAndResizeObjects = function (graph, canvasDest) {
    // Duplicate the drawing objects to resize them in their new fabric canvas container (canvasDest)
    var objects = canvasDest.getObjects();
    for (var i = 0; i < objects.length; i++) {
        canvasDest.remove(objects[i]);
        objects[i] = null;
    }
    canvasDest.renderAll();
    if (graph.designCanvas) {
        var ratioX = canvasDest.getWidth() / graph.realWidth;
        var ratioY = canvasDest.getHeight() / graph.realHeight;
        for (var i = 0; i < graph.drawingJson.length; i++) {
            var obj = graph.drawingJson[i];
            var copy;
            /*fabric.Path and fabric.PathGroup object's are async since fabric.js version 1.2.2
            (https://github.com/kangax/fabric.js/commit/c8cab03aace5510554cd02fa143248ab7497f6c2).
            So you have to differentiate between async and sync objects. */
            if (fabric.util.getKlass(obj.type).async) {
                obj.clone(function (clone) {
                    copy = clone;
                });
            } else {
                copy = obj.clone();
            }
            copy.scaleX *= ratioX;
            copy.scaleY *= ratioY;
            copy.top *= ratioY;
            copy.left *= ratioX;
            copy.setCoords();
            canvasDest.add(copy);
            canvasDest.renderAll();
        }
    }
};
struct.Pellicule = function () {
        // set the Pellicule that contains all the graphs from R++.
    this.list = [];
    this.currentIndex = 0; // current index displayed in the application
    this.next = function () { // get the next graph. Display the 1st one if we are at the end of the list
        if (this.list.length - 1 > this.currentIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        return this.list[this.currentIndex];
    };
    this.previous = function () { // get the previous graph. Display the last graph if we are at the beginning of the list
        if (0 < this.currentIndex) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.list.length - 1;
        }
        return this.list[this.currentIndex];
    };
    this.actual = function () { // get the graph at the current index.
        return this.list[this.currentIndex];
    }
    this.getNumber = function (name) { // get the index of the given name of graph (useful for all_view)
        for(var i = 0; i<this.list.length; i++){
            if (this.list[i].name == name){
                return i;
            }
        }
    }
};
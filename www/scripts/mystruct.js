var struct = {};
struct.createGraph = function (dfname, id, uri, name, typeFilter, min, max, mean, sd, oneQ, median, threeQ, na) {
    var graph = {};
    graph.id = id;
    graph.name = name;
    graph.typeFilter = typeFilter;
    graph.listFilters = [];
    graph.min = min;
    graph.max = max;
    graph.dataFrame = dfname;
    ////////////////////
    graph.mean = mean;
    graph.sd = sd;
    graph.oneQ = oneQ;
    graph.median = median;
    graph.threeQ = threeQ;
    graph.na = na;
    graph.filterEffectives = [];
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
};

struct.duplicateAndResizeObjects = function (graph, canvasDest) {
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
    this.list = [];
    this.currentIndex = 0;
    this.next = function () {
        if (this.list.length - 1 > this.currentIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        return this.list[this.currentIndex];
    };
    this.previous = function () {
        if (0 < this.currentIndex) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.list.length - 1;
        }
        return this.list[this.currentIndex];
    };
    this.actual = function () {
        return this.list[this.currentIndex];
    }
    this.getNumber = function (name) {
        for(var i = 0; i<this.list.length; i++){
            if (this.list[i].name == name){
                return i;
            }
        }
    }
};
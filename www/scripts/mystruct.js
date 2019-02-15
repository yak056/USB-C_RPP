var struct = {};
struct.createGraph = function (id, uri, name, typeFilter, min, max, mean, sd, oneQ, median, threeQ, na, filterEffectives,  listFilter){
    var graph = {};
    graph.id = id;
    graph.name = name;
    graph.typeFilter = typeFilter;
    graph.listFilters = listFilter;
    graph.min = min;
    graph.max = max;
    ////////////////////
    graph.mean = mean;
    graph.sd = sd;
    graph.oneQ = oneQ;
    graph.median = median;
    graph.threeQ = threeQ;
    graph.na = na;
    graph.filterEffectives = filterEffectives;
    /////////////////////////////
    graph.uri = uri;
    graph.fabricCanvas = null;
    graph.designCanvas = null;
    graph.vignetteCanvas = null; //the main canvas 
    graph.familyCanvas = []; //list of all the canvas for the graph except the one with annotation
    graph.drawingJson = []; // to save design shapes in a json 
    return graph;
};

struct.duplicateAndResizeObjects = function (graph, canvasDest){
        if (graph.designCanvas){
        var ratioX = canvasDest.getWidth() / graph.designCanvas.getWidth();
        var ratioY =  canvasDest.getHeight() / graph.designCanvas.getHeight();
        for (var i = 0; i < graph.drawingJson.length; i++){
            var copy = graph.drawingJson[i].clone();
            copy.scaleX *= ratioX;
            copy.scaleY *= ratioY; 
            copy.top *= ratioY 
            copy.left *= ratioX; 
            copy.setCoords();
            canvasDest.add(copy);
            canvasDest.renderAll();
        }
    }
}
struct.Pellicule = function(){
    this.list = [];
    this.currentIndex = 0;
    this.next = function(){
        if (this.list.length -1 > this.currentIndex){
            this.currentIndex++;
        }else{
            this.currentIndex = 0;
        }
        return this.list[this.currentIndex];
    };
    this.previous = function(){
        if (0 < this.currentIndex){
            this.currentIndex--;
        }else{
            this.currentIndex = this.list.length-1;
        }
        return this.list[this.currentIndex];
    };
    this.actual = function(){
        return this.list[this.currentIndex];
    }
};

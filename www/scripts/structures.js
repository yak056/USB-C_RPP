var struct = {};
struct.createGraph = function (uri, name, type, list){
    var graph = {};
    graph.name = name;
    graph.typeFilter = type;
    graph.listFilters = list;
    graph.uri = uri;
    graph.fabricCanvas = null;
    graph.designCanvas = null;
    graph.vignetteCanvas = null; //the main canvas 
    graph.familyCanvas = []; //list of all the canvas for the graph except the one with annotation
    graph.drawingJson = null; // to save design shapes in a json 
    return graph;
};

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

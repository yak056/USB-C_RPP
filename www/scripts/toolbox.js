var toolBox = {};
toolBox.test = 0;
var print = console.log;
$('#styler .stroke-color').simpleColor({
    boxWidth: 80,
    boxHeight: 10,
    livePreview: true,
    onSelect: function(hex, element) {
        STYLE.stroke = '#'+hex;
        applyStyleToSelectedObjects({stroke: STYLE.stroke});
    }
});

toolBox.initCanvas = function(index){
    print("in toolbox index is  : " + index);
    var pellicule = navigation.pellicule.list;
    var canvas = pellicule[index].designCanvas;
    //canvas.loadFromJSON(pellicule[index].drawingJson);
    if (toolBox.test == 2){
    var rect = new fabric.Rect({
        left: 10,
        top: 10,
        fill: 'red',    
        width: 50,
        height: 50,
        zIndex: 10001
      });
      
      // "add" rectangle onto canvas
      canvas.add(rect);
      pellicule[index].drawingJson = canvas.toJSON();
        }
    if (toolBox.test == 4){
        var rect = new fabric.Rect({
            left: 60,
            top: 10,
            fill: 'blue',    
            width: 50,
            height: 50,
            zIndex: 101
          });
          
          // "add" rectangle onto canvas
          canvas.add(rect);
          pellicule[index].drawingJson = canvas.toJSON();
        }
        if (toolBox.test == 6){
            var rect = new fabric.Rect({
                left: 10,
                top: 60,
                fill: 'white',    
                width: 50,
                height: 50,
                zIndex: 101
              });
              
              // "add" rectangle onto canvas
              canvas.add(rect);
              pellicule[index].drawingJson = canvas.toJSON();
            }
    print(pellicule[index].drawingJson);
    pellicule[index].vignetteCanvas.loadFromJSON(pellicule[index].drawingJson, function() {
        pellicule[index].vignetteCanvas.renderAll(); 
     });
         toolBox.test++;
}
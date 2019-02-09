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
    var pellicule = navigation.pellicule.list;
    if (pellicule[index].fabricCanvas == null){
        pellicule[index].fabricCanvas= new fabric.Canvas(document.getElementById("img_for_annotation"));
         pellicule[index].fabricCanvas.setBackgroundImage(pellicule[index].uri, pellicule[index].fabricCanvas.renderAll.bind(pellicule[index].fabricCanvas), {
            // Optionally add an opacity lvl to the image
            backgroundImageOpacity: 0.5,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        });
    }
    var canvas = pellicule[index].fabricCanvas;
    canvas.loadFromJSON(pellicule[index].jsonObjects);
    if (toolBox.test == 2){
    var rect = new fabric.Rect({
        left: 10,
        top: 10,
        fill: 'red',    
        width: 20,
        height: 20,
        zIndex: 101
      });
      
      // "add" rectangle onto canvas
      canvas.add(rect);
    }
    if (toolBox.test == 4){
        var rect = new fabric.Rect({
            left: 10,
            top: 10,
            fill: 'blue',    
            width: 20,
            height: 20,
            zIndex: 101
          });
          
          // "add" rectangle onto canvas
          canvas.add(rect);
        }
        if (toolBox.test == 6){
            var rect = new fabric.Rect({
                left: 10,
                top: 10,
                fill: 'white',    
                width: 20,
                height: 20,
                zIndex: 101
              });
              
              // "add" rectangle onto canvas
              canvas.add(rect);
            }
    pellicule[index].jsonObjects = JSON.stringify(canvas);
    print(JSON.stringify(canvas));
    toolBox.test++;
}
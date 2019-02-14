var toolBox = {};
toolBox.test = 0;
var print = console.log;
$('#styler .stroke-color').simpleColor({
    boxWidth: 80,
    boxHeight: 10,
    livePreview: true,
    onSelect: function (hex, element) {
        STYLE.stroke = '#' + hex;
        applyStyleToSelectedObjects({
            stroke: STYLE.stroke
        });
    }
});

toolBox.initCanvas = function (index) {
    console.log("//////////////////////////START INIT CANVAS with index : " +  index);
    var pellicule = navigation.pellicule.list;
    var graph = pellicule[index];
    var canvas = graph.designCanvas;
    console.log(canvas);
    STYLE = {
        fill: "rgba(0,0,0,0)",
        stroke: "#b3e280",
        strokeWidth: 2,
    };
    var ACTIVE_TOOL = "";
    canvas.enableSelection = function () {
        this.selection = true;
        var objects = this.getObjects();
        for (var i = 0; i < objects.length; i++) {
            objects[i].selectable = true;
        }
    };
    canvas.disableSelection = function () {
        this.selection = false;
        var objects = this.getObjects();
        for (var i = 0; i < objects.length; i++) {
            objects[i].selectable = false;
        }
    };

    // ========================
    // = Handling the toolbar =
    // ========================
    // Changes active tool when a click occurs on their icon
    $('#toolbar a').click(function (event) {
        $('#toolbar .active').removeClass('active');
        var tool = $(this);
        console.log("clilck on : " + tool.text().trim());
        tool.addClass('active');
        ACTIVE_TOOL = tool.text().trim();
        if (ACTIVE_TOOL == 'Path') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingLineWidth = STYLE.strokeWidth;
            canvas.freeDrawingColor = STYLE.stroke;
            canvas.disableSelection();
        } else {
            canvas.isDrawingMode = false;
            canvas.disableSelection();
        }
    });

    // ===================================
    // = Handling the creation of shapes =
    // ===================================

    creating = false;
    shape = null;
    pointerLocation = {x:0, y:0};
//here is the bug --> $('canvas'), how to select the good one ?
    $('canvas')
    .mousedown(function (event) {
        if (canvas.isDrawingMode) {
            return;
        }
        console.log("in mouse DOWN : case" + ACTIVE_TOOL)
        creating = true;
        pointerLocation.x = event.pageX;
        pointerLocation.y = event.pageY;
        switch (ACTIVE_TOOL) {
            case 'Rectangle':
                shape = new fabric.Rect({
                    left: pointerLocation.x,
                    top: pointerLocation.y,
                    fill: STYLE.fill,
                    stroke: STYLE.stroke,
                    strokeWidth: STYLE.strokeWidth,
                    width: 0,
                    height: 0,
                    // originX: 'left',
                    // originY: 'top'
                });
                break;
            case 'Ellipse':
                shape = new fabric.Ellipse({
                    left: pointerLocation.x,
                    top: pointerLocation.y,
                    fill: STYLE.fill,
                    stroke: STYLE.stroke,
                    strokeWidth: STYLE.strokeWidth,
                    rx: 1,
                    ry: 1,
                });
                break;
            case 'Line':
                shape = new fabric.Line(
                    [pointerLocation.x, pointerLocation.y, pointerLocation.x, pointerLocation.y],
                    {
                        fill: STYLE.stroke,
                        stroke: STYLE.stroke,
                        strokeWidth: STYLE.strokeWidth,
                    }
                );
                break;
        }
        shape.selectable = false;
        canvas.add(shape);
    })
    .mousemove(function (event) {
        if (creating) {
            console.log("in mouse MOVE : case" + ACTIVE_TOOL)
            switch (ACTIVE_TOOL) {
                case 'Rectangle':
                    var width, height;
                    shape.set({
                        width: width = event.pageX - pointerLocation.x,
                        height: height = event.pageY - pointerLocation.y,
                        left: pointerLocation.x + width / 2,
                        top: pointerLocation.y + height / 2,
                    });
                    break;
                case 'Ellipse':
                    var rx, ry;
                    shape.set({
                        rx: rx = (event.pageX - pointerLocation.x) / 2,
                        ry: ry = (event.pageY - pointerLocation.y) / 2,
                        // Weirdly, we have to set these as well…
                        width: rx * 2,
                        height: ry * 2,
                    });
                    shape.left = pointerLocation.x + rx;
                    shape.top = pointerLocation.y + ry;
                    break;
                case 'Line':
                    shape.set({
                        x2: event.pageX,
                        y2: event.pageY,
                    });
                    break;
            }
            canvas.renderAll();
        }
    })
    .mouseup(function (event) {
        if (creating) {
            console.log("in mouse UP : case" + ACTIVE_TOOL)
            creating = false;
            shape.remove();
            canvas.add(shape = shape.clone());
            pellicule[index].drawingJson = canvas.getObjects();
            struct.duplicateAndResizeObjects(pellicule[index], pellicule[index].vignetteCanvas);
            console.log("for adding to vignette : " + index);
            shape.selectable = false;
        }
    })
;

			// Select tool based on url hash value
			var tool = window.location.hash.substring(1);
			// By default, the selection tool is active
			if (tool.length == 0) tool = 'rectangle';
			// Simulate a click on the selected tool
			$('#toolbar a.' + tool).click();



            $('#toolbar button').prop('disabled', true);
			
			$('#toolbar button:contains(Delete)').click(function (event) {
				// Removes a shape
				var activeObject = canvas.getActiveObject(),
					activeGroup = canvas.getActiveGroup();
				if (activeGroup) {
					var objectsInGroup = activeGroup.getObjects();
					canvas.discardActiveGroup();
					for (var i = 0; i < objectsInGroup.length; i++) {
						canvas.remove(objectsInGroup[i]);
                    }
                    pellicule[index].drawingJson = canvas.getObjects();
				}
				else if (activeObject) {
					canvas.remove(activeObject);
                }
                pellicule[index].drawingJson = canvas.getObjects();
                struct.duplicateAndResizeObjects(pellicule[index], pellicule[index].vignetteCanvas);
				canvas.fire('selection:cleared');
			});

			// =============================
			// = Handling style attribtues =
			// =============================
			
			var applyStyleToSelectedObjects = function (styles) {
				var activeObject = canvas.getActiveObject(),
					activeGroup = canvas.getActiveGroup();
				if (activeGroup) {
					var objectsInGroup = activeGroup.getObjects(), styleName;
					for (styleName in styles) {
						for (var i = 0; i < objectsInGroup.length; i++) {
							objectsInGroup[i][styleName] = styles[styleName];
						}
					}
				} else if (activeObject) {
					for (styleName in styles) {
						activeObject[styleName] = styles[styleName];
					}
				}
                canvas.renderAll();
                pellicule[index].drawingJson = canvas.getObjects();
                struct.duplicateAndResizeObjects(pellicule[index], pellicule[index].vignetteCanvas);
                pellicule[index].drawingJson = canvas.getObjects();
                
			};
            $('#styler .stroke-color').simpleColor({
				boxWidth: 80,
				boxHeight: 10,
				livePreview: true,
				onSelect: function(hex, element) {
					STYLE.stroke = '#'+hex;
					applyStyleToSelectedObjects({stroke: STYLE.stroke});
				}
			});
			
			$('#styler .stroke-width').change(function (event) {
				STYLE.strokeWidth = parseInt($(this).val());
				applyStyleToSelectedObjects({strokeWidth: STYLE.strokeWidth});
            });
            
            // Update the styling inspector when a single object is selected
			canvas.observe('object:selected', function (event) {
				// Enable buttons
				$('#toolbar button').prop('disabled', false);
				// Apply style to styler inspector
				$('#styler .stroke-color').setColor(event.target.stroke);
				$('#styler .stroke-width').val(event.target.strokeWidth);
            });

            // Update the styling inspector when several objects are selected
			canvas.observe('selection:created', function (event) {
				// Enable buttons
				$('#toolbar button').prop('disabled', false);
				var
					selectedObjects = event.target.getObjects(),
					selectedStyle = {};
				for (styleName in STYLE) {
					selectedStyle[styleName] = selectedObjects[0][styleName];
				}
				for (styleName in STYLE) {
					for (var i = 1; i < selectedObjects.length; i++) {
						if (selectedObjects[i][styleName] != selectedStyle[styleName]) {
							selectedStyle[styleName] = null;
							break;
						}
					}
				}
				if (selectedStyle.stroke != null)
					$('#styler .stroke-color').setColor(selectedStyle.stroke);
				if (selectedStyle.strokeWidth != null)
					$('#styler .stroke-width').val(selectedStyle.strokeWidth);
			});
			
			canvas.observe('selection:cleared', function (event) {
				$('#toolbar button').prop('disabled', true);
			});
			


        }



toolBox.initCanvas2 = function(index) {
    var graph = navigation.pellicule.list[index];
    var canvas = pellicule[index].designCanvas;


    //canvas.loadFromJSON(pellicule[index].drawingJson);
    if (toolBox.test == 2) {
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
        pellicule[index].drawingJson = canvas.getObjects();
    }
    if (toolBox.test == 4) {
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
        pellicule[index].drawingJson = canvas.getObjects();
    }
    if (toolBox.test == 6) {
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
        pellicule[index].drawingJson = canvas.getObjects();
    }

    /*pellicule[index].vignetteCanvas.loadFromJSON(pellicule[index].drawingJson, function() {
        pellicule[index].vignetteCanvas.renderAll(); 
     });*/
    struct.duplicateAndResizeObjects(pellicule[index], pellicule[index].vignetteCanvas);
    toolBox.test++;
};
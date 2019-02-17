var toolBox = {};
toolBox.selected = null;
toolBox.test = 0;
toolBox.ACTIVE_TOOL = '';
toolBox.canvas = null;
toolBox.pellicule = null;
toolBox.objects = null;
toolBox.shape = null;
toolBox.creating = false;
toolBox.pointerLocation = null;

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
    $('#BCC_img_for_annotation').off();
    $('#toolbar button:contains(Delete)').off();
    //console.log(jQuery._data( document.getElementById("BCC_img_for_annotation"), "events" ))
    toolBox.pellicule = navigation.pellicule.list;
    var graph = toolBox.pellicule[index];
    toolBox.canvas = graph.designCanvas;
    STYLE = {
        fill: "rgba(0,0,0,0)",
        stroke: "#b3e280",
        strokeWidth: 2,
    };
    toolBox.canvas.enableSelection = function () {
        //$('#BCC_img_for_annotation').off();
        this.selection = true; // permet selection multiple
        //console.log("in enable selection");
        var objects = this.getObjects();
        //console.log(jQuery._data( document.getElementById("BCC_img_for_annotation"), "events" ))
        for (var i = 0; i < objects.length; i++) {
            objects[i].selectable = true;
        }
        //print(toolBox.canvas);

    };
    toolBox.canvas.disableSelection = function () {
        this.selection = false;
        //console.log(this);
        //console.log("in disable selection");
        //console.log(jQuery._data( document.getElementById("BCC_img_for_annotation"), "events" ))
        var objects = toolBox.canvas.getObjects();
        for (var i = 0; i < objects.length; i++) {
            objects[i].selectable = false;
        }
    };

    toolBox.canvas.selectionColor = 'rgba(255, 165, 0, 0.3)';
    toolBox.canvas.selectionBorderColor = 'orange';
    fabric.Object.prototype.cornerSize = 7;
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = 'orange';
    fabric.Object.prototype.borderColor = 'orange';

    // ========================
    // = Handling the toolbar =
    // ========================
    // Changes active tool when a click occurs on their icon
    $('#toolbar a').click(function (event) {
        event.stopImmediatePropagation();
        var tool = $(this);
        toolBox.selected = tool.text().trim();
        $('#toolbar .active').removeClass('active');
        if (toolBox.ACTIVE_TOOL !== toolBox.selected) {
            toolBox.ACTIVE_TOOL = tool.text().trim();
            tool.addClass('active');
            toolBox.canvas.disableSelection();
            toolBox.initBCCListeners();
            //print(toolBox.ACTIVE_TOOL);
        } else {
            toolBox.ACTIVE_TOOL = 'Selection';
            $('#BCC_img_for_annotation').off();
            toolBox.canvas.enableSelection();
            //print(toolBox.ACTIVE_TOOL);
        }
        if (toolBox.ACTIVE_TOOL === 'Path') {
            $('#BCC_img_for_annotation').off();
            //console.log(toolBox.ACTIVE_TOOL)
            toolBox.canvas.isDrawingMode = true;
            toolBox.canvas.freeDrawingLineWidth = STYLE.strokeWidth;
            toolBox.canvas.freeDrawingColor = STYLE.stroke;
            //print(toolBox.ACTIVE_TOOL);

        } else {
            toolBox.canvas.isDrawingMode = false;
        }
    });



    // ===================================
    // = Handling the creation of shapes =
    // ===================================

    toolBox.creating = false;
    toolBox.pointerLocation = {x:0, y:0};
//here is the bug --> $('canvas'), how to select the good one ?
toolBox.initBCCListeners = function(){
$('#BCC_img_for_annotation')
        .mousedown(function (event) {
            if (toolBox.canvas.selection ||toolBox.canvas.isDrawingMode) {
                return;
            }
            toolBox.creating = true;
            toolBox.pointerLocation.x = event.pageX - document.getElementById('BCC_img_for_annotation').getBoundingClientRect().x;
            toolBox.pointerLocation.y = event.pageY;
            switch (toolBox.ACTIVE_TOOL) {
                case 'Rectangle':
                    toolBox.shape = new fabric.Rect({
                        left: toolBox.pointerLocation.x,
                        top: toolBox.pointerLocation.y,
                        fill: STYLE.fill,
                        stroke: STYLE.stroke,
                        strokeWidth: STYLE.strokeWidth,
                        width: 0,
                        height: 0,
                        //originX: 'left',
                        //originY: 'top'
                    });
                    toolBox.shape.selectable = false;
                    toolBox.canvas.add(toolBox.shape);
                    break;
                case 'Ellipse':
                    toolBox.shape = new fabric.Ellipse({
                        left: toolBox.pointerLocation.x,
                        top: toolBox.pointerLocation.y,
                        fill: STYLE.fill,
                        stroke: STYLE.stroke,
                        strokeWidth: STYLE.strokeWidth,
                        rx: 1,
                        ry: 1,
                    });
                    toolBox.shape.selectable = false;
                    toolBox.canvas.add(toolBox.shape);
                    break;
                case 'Selection':
                    toolBox.shape = null;
                    break;
            }

        })
        .mousemove(function (event) {
            if (toolBox.creating) {
                switch (toolBox.ACTIVE_TOOL) {
                    case 'Rectangle':
                        var width, height;
                        toolBox.shape.set({
                            width: width = event.pageX - document.getElementById('BCC_img_for_annotation').getBoundingClientRect().x - toolBox.pointerLocation.x,
                            height: height = event.pageY - toolBox.pointerLocation.y,
                            left: toolBox.pointerLocation.x + width / 2,
                            top: toolBox.pointerLocation.y + height / 2,
                        });
                        break;
                    case 'Ellipse':
                        var rx, ry;
                        toolBox.shape.set({
                            rx: rx = (event.pageX - document.getElementById('BCC_img_for_annotation').getBoundingClientRect().x - toolBox.pointerLocation.x) / 2,
                            ry: ry = (event.pageY - toolBox.pointerLocation.y) / 2,
                            // Weirdly, we have to set these as well…
                            width: rx * 2,
                            height: ry * 2,
                        });
                        toolBox.shape.left = toolBox.pointerLocation.x + rx;
                        toolBox.shape.top = toolBox.pointerLocation.y + ry;
                        break;
                    case 'Line':
                        toolBox.shape.set({
                            x2: event.pageX,
                            y2: event.pageY,
                        });
                        break;
                }
                toolBox.canvas.renderAll();
            }
        })
        .mouseup(function (event) {
            if (toolBox.creating) {
                toolBox.creating = false;
                if (toolBox.shape != null){
                    toolBox.shape.remove();
                    toolBox.canvas.add(toolBox.shape = toolBox.shape.clone());
                    toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
                    struct.duplicateAndResizeObjects(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
                    toolBox.shape.selectable = false;
                    //console.log(toolBox.canvas.getObjects());
                }
            }
        })}
    ;

    // Select tool based on url hash value
    var tool = window.location.hash.substring(1);
    // By default, the selection tool is active
    if (tool.length == 0) tool = 'rectangle';
    // Simulate a click on the selected tool
    $('#toolbar a.' + tool).click();



    $('#toolbar button').prop('disabled', true);

    $('#toolbar button:contains(Delete)').click(function (event) {
        // Removes a toolBox.shape
        var activeObject = toolBox.canvas.getActiveObject(),
            activeGroup = toolBox.canvas.getActiveGroup();
        if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            toolBox.canvas.discardActiveGroup();
            for (var i = 0; i < objectsInGroup.length; i++) {
                toolBox.canvas.remove(objectsInGroup[i]);
            }
        }
        else if (activeObject) {
            toolBox.canvas.remove(activeObject);
        }
        print(toolBox.canvas.getObjects());
        toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
        struct.duplicateAndResizeObjects(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
        toolBox.canvas.fire('selection:cleared');
    });

    // =============================
    // = Handling style attribtues =
    // =============================

    var applyStyleToSelectedObjects = function (styles) {
        var activeObject = toolBox.canvas.getActiveObject(),
            activeGroup = toolBox.canvas.getActiveGroup();
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
        toolBox.canvas.renderAll();
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
    toolBox.canvas.observe('object:selected', function (event) {
        // Enable buttons
        $('#toolbar button').prop('disabled', false);
        // Apply style to styler inspector
        $('#styler .stroke-color').setColor(event.target.stroke);
        $('#styler .stroke-width').val(event.target.strokeWidth);
    });

    // Update the styling inspector when several objects are selected
    toolBox.canvas.observe('selection:created', function (event) {
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

    toolBox.canvas.observe('selection:cleared', function (event) {
        $('#toolbar button').prop('disabled', true);
    });



};




toolBox.initCanvas2 = function(index) {
    toolBox.canvas = toolBox.pellicule[index].designCanvas;
    var rect;

    if (toolBox.test == 2) {
        rect = new fabric.Rect({
            left: 10,
            top: 10,
            fill: 'red',
            width: 50,
            height: 50,
            zIndex: 10001
        });

        // "add" rectangle onto canvas
        toolBox.canvas.add(rect);
        toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
    }
    if (toolBox.test == 4) {
        rect = new fabric.Rect({
            left: 60,
            top: 10,
            fill: 'blue',
            width: 50,
            height: 50,
            zIndex: 101
        });

        // "add" rectangle onto canvas
        toolBox.canvas.add(rect);
        toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
    }
    if (toolBox.test == 6) {
        rect = new fabric.Rect({
            left: 10,
            top: 60,
            fill: 'white',
            width: 50,
            height: 50,
            zIndex: 101
        });

        // "add" rectangle onto canvas
        toolBox.canvas.add(rect);
        toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
    }

    struct.duplicateAndResizeObjects(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
    toolBox.test++;
};
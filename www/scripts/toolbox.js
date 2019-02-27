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
toolBox.firstTime = 0;
toolBox.STYLE = {
    fill: "rgba(0,0,0,0)",
    stroke: "#b3e280",
    strokeWidth: 2,
};
toolBox.offsetLeft = 0;
toolBox.offsetTop = 0;

toolBox.initCanvas = function (index) {
    toolBox.firstTime++;
    $('#toolbar button:contains(Delete)').off();
    toolBox.pellicule = navigation.pellicule.list;
    var graph = toolBox.pellicule[index];
    graph.realHeight = graph.designCanvas.getHeight();
    graph.realWidth = graph.designCanvas.getWidth();
    toolBox.canvas = graph.designCanvas;
    toolBox.offsetLeft = toolBox.canvas._offset.left;
    toolBox.offsetTop = toolBox.canvas._offset.top;



    toolBox.canvas.enableSelection = function () {
        this.selection = true; // permet selection multiple
        var objects = this.getObjects();
        for (var i = 0; i < objects.length; i++) {
            objects[i].selectable = true;
        }

    };
    toolBox.canvas.disableSelection = function () {
        this.selection = false;
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
        } else {
            toolBox.ACTIVE_TOOL = 'Selection';
            toolBox.canvas.enableSelection();
        }
        if (toolBox.ACTIVE_TOOL === 'Path') {
            toolBox.canvas.isDrawingMode = true;

            toolBox.canvas.freeDrawingBrush.width  = toolBox.STYLE.strokeWidth;
            toolBox.canvas.freeDrawingBrush.color = toolBox.STYLE.stroke;
        } else {
            toolBox.canvas.isDrawingMode = false;
        }
    });


    // ===================================
    // = Handling the creation of shapes =
    // ===================================

    toolBox.creating = false;
    toolBox.pointerLocation = {x: 0, y: 0};
    toolBox.canvas.on("mouse:down", function (options) {
        if (toolBox.canvas.selection || toolBox.canvas.isDrawingMode) {
            return;
        }
        toolBox.creating = true;
        var event = options.e.changedTouches[0];
        toolBox.pointerLocation.x = event.pageX - toolBox.offsetLeft;
        toolBox.pointerLocation.y = event.pageY - toolBox.offsetTop;

        switch (toolBox.ACTIVE_TOOL) {
            case 'Rectangle':
                toolBox.shape = new fabric.Rect({
                    left: toolBox.pointerLocation.x,
                    top: toolBox.pointerLocation.y,
                    fill: toolBox.STYLE.fill,
                    stroke: toolBox.STYLE.stroke,
                    strokeWidth: toolBox.STYLE.strokeWidth,
                    width: 0,
                    height: 0,
                });
                toolBox.shape.selectable = false;
                toolBox.canvas.add(toolBox.shape);
                break;
            case 'Ellipse':
                toolBox.shape = new fabric.Ellipse({
                    left: toolBox.pointerLocation.x,
                    top: toolBox.pointerLocation.y,
                    fill: toolBox.STYLE.fill,
                    stroke: toolBox.STYLE.stroke,
                    strokeWidth: toolBox.STYLE.strokeWidth,
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
    });
    toolBox.canvas.on("mouse:move", function (options) {
        var event = options.e.changedTouches[0];
        if (toolBox.creating) {
            switch (toolBox.ACTIVE_TOOL) {
                case 'Rectangle':
                    var width, height;
                    toolBox.shape.set({
                        width: width = event.pageX - toolBox.pointerLocation.x - toolBox.offsetLeft,
                        height: height = event.pageY - toolBox.pointerLocation.y - toolBox.offsetTop,
                        left: toolBox.pointerLocation.x + width / 2,
                        top: toolBox.pointerLocation.y + height / 2,
                    });
                    console.log(toolBox.shape);
                    break;
                case 'Ellipse':
                    var rx, ry;
                    toolBox.shape.set({
                        rx: rx = (event.pageX - toolBox.offsetLeft - toolBox.pointerLocation.x) / 2,
                        ry: ry = (event.pageY - toolBox.offsetTop - toolBox.pointerLocation.y) / 2,
                        // Weirdly, we have to set these as well…
                        width: rx * 2,
                        height: ry * 2,
                    });
                    toolBox.shape.left = toolBox.pointerLocation.x + rx;
                    toolBox.shape.top = toolBox.pointerLocation.y + ry;
                    break;
            }
            toolBox.canvas.renderAll();
        }
    });
    toolBox.canvas.on("mouse:up", function (event) {
        console.log("mouse up");
        if (toolBox.creating ) {
            toolBox.creating = false;
            if (toolBox.shape != null) {
                toolBox.shape.remove();
                toolBox.canvas.add(toolBox.shape = toolBox.shape.clone());
                toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
                struct.duplicateAndResizeObjects(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
                toolBox.shape.selectable = false;
            }
            connection.sendPost();
        }
        else if(toolBox.canvas.isDrawingMode){
            toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
            struct.duplicateAndResizeObjects(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
            connection.sendPost();
        }
    });
    // Select tool based on url hash value
    var tool = window.location.hash.substring(1);
    // By default, the selection tool is active
    if (tool.length == 0) tool = 'rectangle';
    // Simulate a click on the selected tool
    $('#toolbar a.' + tool).click();


    $('#toolbar button').prop('disabled', true);

    $('#toolbar button:contains("")').click(function (event) { // moche a changer select buttin delete
        // Removes a toolBox.shape
        var activeObject = toolBox.canvas.getActiveObject(),
            activeGroup = toolBox.canvas.getActiveGroup();
        if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            toolBox.canvas.discardActiveGroup();
            for (var i = 0; i < objectsInGroup.length; i++) {
                toolBox.canvas.remove(objectsInGroup[i]);
            }
        } else if (activeObject) {
            toolBox.canvas.remove(activeObject);
        }
        toolBox.pellicule[index].drawingJson = toolBox.canvas.getObjects();
        struct.removeObjectsForVignette(toolBox.pellicule[index], toolBox.pellicule[index].vignetteCanvas);
        toolBox.canvas.fire('selection:cleared');
        connection.sendPost();
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
    if (toolBox.firstTime == 1) {
        toolBox.STYLE.stroke = "#b5a822";
        toolBox.STYLE.strokeWidth = 3;
        $('#styler .stroke-color').simpleColor({
            cellWidth: 50,
            cellHeight: 50,
            colors: ['#ff0000', '#ff0087', '#ff875f', '#ffd700',
                '#00005f', '#005faf', '#00afaf', '#00ff00',
                '#080808', '#808080', '#c0c0c0', '#ffffff'],
            columns: 4.1,
            boxWidth: 100,
            boxHeight: 100,
            livePreview: true,
            onSelect: function (hex, element) {
                console.log("STYLE : " + hex);
                toolBox.STYLE.stroke = hex;
                toolBox.canvas.freeDrawingBrush.color = toolBox.STYLE.stroke;
                applyStyleToSelectedObjects({stroke: toolBox.STYLE.stroke});
            }
        });

        $('#styler .stroke-width').change(function (event) {
            toolBox.STYLE.strokeWidth = parseInt($(this).val());
            toolBox.canvas.freeDrawingBrush.width  = toolBox.STYLE.strokeWidth;
            applyStyleToSelectedObjects({strokeWidth: toolBox.STYLE.strokeWidth});
        });
    }

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





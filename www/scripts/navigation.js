var navigation = {};

// #################### TOUCH HANDLER ###########################################
navigation.touchHandler = function (event) {
    if (navigation.actualMainView == "BCC_img_for_annotation") {
        var touches = event.changedTouches,
            first = touches[0],
            type = "";
        switch (event.type) {
            case "touchstart":
                type = "mousedown";
                break;
            case "touchmove":
                type = "mousemove";
                break;
            case "touchend":
                type = "mouseup";
                break;
            default:
                return;
        }

        // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //                screenX, screenY, clientX, clientY, ctrlKey, 
        //                altKey, shiftKey, metaKey, button, relatedTarget);

        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0 /*left*/, null);

        first.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    }
}

navigation.init = function(){
    // changes touchmove event with the touchHandlers defined previously
    document.addEventListener("touchmove", navigation.touchHandler, true);
};
navigation.init();
var print = console.log;

// ###########################  NAVIGATION  ################################

navigation.actualMainView = ""; // actual main view
navigation.json = JSON.parse(data).pellicule;

navigation.pellicule = new struct.Pellicule();

navigation.changeJson = function(new_data){
    var json = JSON.parse(new_data).pellicule;
    navigation.json[3].uri = json[3].uri;
    navigation.pellicule.list[3].uri = json[3].uri;
    navigation.modifyVignette();
    navigation.changeDiv('filter_view');
};

var canvasList = ["img_home", "img_filter", "img_resume", "img_for_annotation"];


////////////////////////////////////////////////////////////////////////////////////////////
navigation.changeDivReal = function (page) {
    // Change the page and init what should be init
    document.getElementById('connexion_view').hidden = true;
    document.getElementById('all_view').hidden = true;
    document.getElementById('filter_view').hidden = true;
    document.getElementById('resume_view').hidden = true;
    document.getElementById('annotation_view').hidden = true;
    document.getElementById('home_view').hidden = true;
    document.getElementById(page).hidden = false;
    if (page == "home_view") navigation.actualMainView = "BCC_img_home";
    else if (page == "filter_view") navigation.actualMainView = "BCC_img_filter";
    else if (page == "resume_view") {
        navigation.actualMainView = "BCC_img_resume";
        resume.init()
    } else if (page == "annotation_view") {
        navigation.actualMainView = "BCC_img_for_annotation";
        toolBox.initCanvas(navigation.pellicule.currentIndex);

    }
    navbar.hidePellicule(page);// hide the pellicule if we have to hide it on page
};

navigation.changeDiv = function (page) {
        // Change page and simulate a click on current graph
    navigation.changeDivReal(page);
    var currIndex = navigation.pellicule.currentIndex;
    navigation.simulEvent(document.getElementById("img_" + currIndex), "click");
};

navigation.simulEvent = function (idHTML, eventType) {
        // Simulate event for loading the image when we change the menu selection (resume, annotation, ...)
    if (idHTML.fireEvent) {
        idHTML.fireEvent("on" + eventType)
    } else {
        var eventObject = document.createEvent("Events");
        eventObject.initEvent(eventType, true, false);
        idHTML.dispatchEvent(eventObject);
    }
};

navigation.initCanvasForPellicule = function (id, index, imgUrl) {
        // Initialize the canvas for each graph for the pellicule
    var canvas = new fabric.Canvas(document.getElementById(id));
    var height = parseInt(getComputedStyle(document.getElementById("pellicule")).height);
    var width = parseInt(getComputedStyle(document.getElementById("pellicule")).width);
    var side = (height < width) ? height : width;
    canvas.setDimensions({
        width: side * 0.9,
        height: side * 0.9
    }, {
        cssOnly: false
    });
    canvas.setBackgroundImage(
        imgUrl,
        canvas.renderAll.bind(canvas), {
            // Optionally add an opacity lvl to the image
            backgroundImageOpacity: 1,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        });
    navigation.pellicule.list[index].vignetteCanvas = canvas;
    struct.duplicateAndResizeObjects(navigation.pellicule.list[index], canvas);

};

navigation.initCanvasForMainView = function (id, index, imgUrl) {
    // Initialize the canvas for the main view
    imgUrl = navigation.pellicule.list[index].uri;
    var divContainer = document.getElementById("BCC_" + id);
    divContainer.innerHTML = "<canvas class=\"bigImg\" id=\"" + id + "\"></canvas>";
    var canvas = new fabric.Canvas(document.getElementById(id));
    var height = parseInt(getComputedStyle(document.getElementById(navigation.actualMainView)).height);
    var width = parseInt(getComputedStyle(document.getElementById(navigation.actualMainView)).width);
    var side = (height < width) ? height : width;
    canvas.setDimensions({
        width: side,
        height: side
    }, {
        cssOnly: false
    });
    canvas.setBackgroundImage(
        imgUrl,
        canvas.renderAll.bind(canvas), {
            // Optionally add an opacity lvl to the image
            backgroundImageOpacity: 1,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        }
    );
    //canvas.loadFromJSON(navigation.pellicule.list[index].drawingJson);
    struct.duplicateAndResizeObjects(navigation.pellicule.list[index], canvas);
    if (id == "img_for_annotation")navigation.pellicule.list[index].designCanvas = canvas;
    else navigation.pellicule.list[index].familyCanvas.push(canvas);
    document.getElementById(navigation.actualMainView).style.height = side + "px";
    document.getElementById(navigation.actualMainView).style.width = side + "px";

    if(id != "img_for_annotation"){
        canvas.selection = false;
        canvas.forEachObject(function(o) {
        o.selectable = false;  // delete the selectable property on all canvas except the one from annotation
        }); 
    }

};
//////////////////////////////////////////////////////////////////////////////////////////////////
navigation.createPellicule = function () {
        // Create the pellicule with the graphs loaded from R++
    for (var i = 0; i < navigation.json.length; i++) {
        var graph = navigation.json[i];
        navigation.pellicule.list.push(struct.createGraph(i, graph.uri, graph.nom, graph.typeFilter, graph.min,
            graph.max, graph.mean, graph.sd, graph.oneQ, graph.median, graph.threeQ, graph.na, graph.filterEffectives, graph.filterNames));
    }
    const img = document.createElement("img");

    for (var i = 0; i < navigation.pellicule.list.length; i++) {
        img.src = navigation.pellicule.list[i].uri;
        const pelliculeHtml = document.getElementById("pellicule");
        var string = '<div id="vignetteContainer" style=" display:inline-block ; height=100% width=20%">' +
            '<canvas class="col-xs-2 img_pellicule"' + ' id="img_' + i + '" ></canvas></div>';
        pelliculeHtml.innerHTML += string;

    }
    for (var i = 0; i < navigation.pellicule.list.length; i++) {
        navigation.initCanvasForPellicule("img_" + i, i, navigation.pellicule.list[i].uri);
        document.getElementById("img_" + i).style.zIndex = "1001";
        document.getElementById("img_" + i).addEventListener("click", navigation.changeImgMainView(navigation.pellicule.list[i].uri, i));
    }
};

navigation.draw_image = function (image, ctx) {
    return function () {
        var height = getComputedStyle(document.getElementById("pellicule")).height;
        ctx.drawImage(image, 0, 0, parseInt(height) * 0.9, parseInt(height) * 0.9);
    }
};

navigation.maj_img_canvas = function (img, index) {
        // update the index, init Resume if needed and init the Canvas
    if (index != null) {
        navigation.pellicule.currentIndex = index;
    }
    if (navigation.actualMainView == "BCC_img_resume") {
        resume.init();
    }
    for (var i = 0; i < canvasList.length; i++) {
        navigation.initCanvasForMainView(canvasList[i], index, img);
    }
    //to wrap canvas in a Fabric canvas
    if (navigation.actualMainView == "BCC_img_for_annotation")
        toolBox.initCanvas(index);
    connection.sendPost();
};
navigation.changeImgMainView = function (img, index) {
    return function () {
        navigation.maj_img_canvas(img, index);
    }
};

navigation.onswipe = function (direction) {
        // go to next or previous graph on swipe
    if (direction == "left") {
        var graph = navigation.pellicule.next();
        navigation.maj_img_canvas(graph.uri, navigation.pellicule.currentIndex);
    } else if (direction == "right") {
        var graph = navigation.pellicule.previous();
        navigation.maj_img_canvas(graph.uri, navigation.pellicule.currentIndex);
    }
    toolBox.initCanvas(navigation.pellicule.currentIndex);
};

$('.BigCanvasContainer').swipe({
    //Generic swipe handler for all directions
    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        navigation.onswipe(direction);
    }
});

navigation.modifyVignette = function(){
    // to deal with hard coded filter
    var canvasPellicule = navigation.pellicule.list[3].vignetteCanvas;
    canvasPellicule.setBackgroundImage(
        navigation.pellicule.list[3].uri,
        canvasPellicule.renderAll.bind(canvasPellicule), {
            // Optionally add an opacity lvl to the image
            backgroundImageOpacity: 1,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        }
    );
};


navigation.createPellicule();
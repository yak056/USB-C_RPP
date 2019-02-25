var distantScreen = {};
distantScreen.socket = null;
distantScreen.graph = null;
distantScreen.start = function() {
    distantScreen.socket = io("http://localhost:4040");
    distantScreen.socket.on("tablet", function(data)  {
        distantScreen.graph = data;
        console.log(data);
        if (!data.displayResume){
            console.log("rrrrrrr");
            document.getElementById("resume_view").hidden = true;
            document.getElementById("home_view").hidden = false;
            distantScreen.actualMainView = "BCC_img_home";
            distantScreen.initCanvasForMainView("img_home", 0, data.url);
        }
        else{
            console.log("REZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
            document.getElementById("resume_view").hidden = false;
            document.getElementById("home_view").hidden = true;
            distantScreen.actualMainView = "BCC_img_resume";
            distantScreen.initCanvasForMainView("img_resume", 0, data.url);   
            resume.init();

        }
        
    })
}


distantScreen.initCanvasForMainView = function (id, index, imgUrl) {
    var divContainer = document.getElementById("BCC_" + id);
    divContainer.innerHTML = "<canvas class=\"bigImg\" id=\"" + id + "\"></canvas>";
    var canvas = new fabric.Canvas(document.getElementById(id));
    var height = parseInt(getComputedStyle(document.getElementById(distantScreen.actualMainView)).height);
    var width = parseInt(getComputedStyle(document.getElementById(distantScreen.actualMainView)).width);
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
            backgroundImageOpacity: 0.5,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        }
    );
    //canvas.loadFromJSON(navigation.pellicule.list[index].drawingJson);
    //struct.duplicateAndResizeObjects(navigation.pellicule.list[index], canvas);
    //if (id == "img_for_annotation")navigation.pellicule.list[index].designCanvas = canvas;
    //else navigation.pellicule.list[index].familyCanvas.push(canvas);
    document.getElementById(distantScreen.actualMainView).style.height = side + "px";
    document.getElementById(distantScreen.actualMainView).style.width = side + "px";


};
distantScreen.start();
console.log("hhhhhhhhhhhh");
distantScreen.initCanvasForMainView("img_resume", 0, "img/id.png");
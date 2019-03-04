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
            document.getElementById("ip").hidden = true;
            document.getElementById("home_view").hidden = false;
            distantScreen.actualMainView = "BCC_img_home";
            distantScreen.initCanvasForMainView("img_home", 0, data.url);
        }
        else{
            console.log("REZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
            document.getElementById("resume_view").hidden = false;
            document.getElementById("home_view").hidden = true;
            document.getElementById("ip").hidden = true;
            distantScreen.actualMainView = "BCC_img_resume";
            distantScreen.initCanvasForMainView("img_resume", 0, data.url);   
            resume.init();

        }
    });

};
function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
            iceServers: []
        }),
        noop = function() {},
        localIPs = {},
        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
        key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

    //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });

        pc.setLocalDescription(sdp, noop, noop);
    }, noop);

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage

getUserIP(function(ip){
    document.getElementById('ip').innerText = "Connectez vous sur : " + ip;
});

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
            backgroundImageOpacity: 1,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        }
    );
        var json = JSON.parse(distantScreen.graph.jsonCanvas);
        console.log(json.objects);
        //canvas.loadFromJSON(json);
        distantScreen.duplicateAndResizeObjects(json.objects, distantScreen.graph.height, distantScreen.graph.width, canvas);
    
    //struct.duplicateAndResizeObjects(navigation.pellicule.list[index], canvas);
    //if (id == "img_for_annotation")navigation.pellicule.list[index].designCanvas = canvas;
    //else navigation.pellicule.list[index].familyCanvas.push(canvas);
    document.getElementById(distantScreen.actualMainView).style.height = side + "px";
    document.getElementById(distantScreen.actualMainView).style.width = side + "px";


};
distantScreen.duplicateAndResizeObjects = function (listObjects, heightOrigin ,widthOrigin, canvasDest) {
    /*for (var i = 0; i < objects.length; i++) {
        canvasDest.remove(objects[i]);
        objects[i] = null;
    }
    canvasDest.renderAll();*/
        var ratioX = canvasDest.getWidth() / heightOrigin;
        var ratioY = canvasDest.getHeight() / widthOrigin;
        console.log(listObjects);
        //for (var i = 0; i < listObjects.length; i++) {
        fabric.util.enlivenObjects(listObjects, function(objects){
            objects.forEach(function(obj){
                obj.scaleX *= ratioX;
                obj.scaleY *= ratioY;
                obj.top *= ratioY;
                obj.left *= ratioX;
                obj.setCoords();
                canvasDest.add(obj);
                canvasDest.renderAll();
            })

            });
            /*if (fabric.util.getKlass(obj.type).async) {
                obj.clone(function (clone) {
                    copy = clone;
                });
            } else {
                copy = obj.clone();
            }*/
            //copy = obj.clone();

        //}
};

distantScreen.start();
document.getElementById("resume_view").hidden = true;
document.getElementById("ip").hidden = false;
document.getElementById("home_view").hidden = true;
distantScreen.initCanvasForMainView("img_resume", 0, "img/id.png");
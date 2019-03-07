var distantScreen = {};
distantScreen.socket = null;
distantScreen.graph = null;

distantScreen.start = function () {
    distantScreen.socket = io("http://localhost:4040"); // Connection to the server on port 4040
    distantScreen.socket.on("tablet", function (data) {
        distantScreen.graph = data;
        if (!data.displayResume) {
            // Check if we want to display the resume. Hide the corresponding div in the html
            document.getElementById("resume_view").hidden = true;
            document.getElementById("ip").hidden = true;
            document.getElementById("home_view").hidden = false;
            distantScreen.actualMainView = "BCC_img_home";
            distantScreen.initCanvasForMainView("img_home", 0, data.url);
        } else {
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
    var pc = new myPeerConnection({iceServers: []}),
        noop = function () {},
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
    pc.createOffer(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        pc.setLocalDescription(sdp, noop, noop);
    }, noop);
    //listen for candidate events
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

getUserIP(function (ip) {
    // Show the ip address of the computer to connect the tablet
    document.getElementById('ip').innerText = "Connectez vous sur : " + ip;
});

distantScreen.initCanvasForMainView = function (id, index, imgUrl) {
    // Initialize the Main view Canvas to have the biggest square possible in the corresponding div
    var divContainer = document.getElementById("BCC_" + id);
    divContainer.innerHTML = "<canvas class=\"bigImg\" id=\"" + id + "\"></canvas>";
    var canvas = new fabric.Canvas(document.getElementById(id));
    var height = parseInt(getComputedStyle(document.getElementById(distantScreen.actualMainView)).height);
    var width = parseInt(getComputedStyle(document.getElementById(distantScreen.actualMainView)).width);
    var side = (height < width) ? height : width; // get height if height < width, else width
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
    distantScreen.duplicateAndResizeObjects(json.objects, distantScreen.graph.height, distantScreen.graph.width, canvas);
    document.getElementById(distantScreen.actualMainView).style.height = side + "px";
    document.getElementById(distantScreen.actualMainView).style.width = side + "px";


};
distantScreen.duplicateAndResizeObjects = function (listObjects, heightOrigin, widthOrigin, canvasDest) {
    // Duplicate the drawing objects to resize them in their new fabric canvas container
    var ratioX = canvasDest.getWidth() / heightOrigin;
    var ratioY = canvasDest.getHeight() / widthOrigin;
    fabric.util.enlivenObjects(listObjects, function (objects) {
        objects.forEach(function (obj) {
            obj.scaleX *= ratioX;
            obj.scaleY *= ratioY;
            obj.top *= ratioY;
            obj.left *= ratioX;
            obj.setCoords();
            canvasDest.add(obj);
            canvasDest.renderAll();
        })
    });
};

distantScreen.start();
document.getElementById("resume_view").hidden = true;
document.getElementById("ip").hidden = false;
document.getElementById("home_view").hidden = true;
distantScreen.initCanvasForMainView("img_resume", 0, "img/id.png");
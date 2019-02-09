var navigation = {};
var print = console.log;
const name = "img/img_";
var tab_name = [];
for (var i=1; i<9; i++){
    tab_name.push(name+i+".png");
}
console.log(tab_name);

var canvasList=["img_home", "img_search", "img_filter", "img_for_annotation", "img_resume"];
navigation.pellicule = new struct.Pellicule();

////////////////////////////////////////////////////////////////////////////////////////////


navigation.initCanvas = function(id, index, imgUrl){
    var canvas = new fabric.Canvas(document.getElementById(id));
    var height = parseInt(getComputedStyle(document.getElementById("pellicule")).height);
    var width = parseInt(getComputedStyle(document.getElementById("pellicule")).width);
    canvas.setDimensions({width: width * 0.2, height: height * 0.9}, {cssOnly: false});
    print(id, index, imgUrl);
    canvas.setBackgroundImage(
        imgUrl, 
        canvas.renderAll.bind(canvas), {
            // Optionally add an opacity lvl to the image
            backgroundImageOpacity: 0.5,
            // should the image be resized to fit the container?
            backgroundImageStretch: true
        });
    if (id == "img_for_annotation") navigation.pellicule.list[index].fabricCanvas = canvas;
    else  navigation.pellicule.list[index].familyCanvas.push(canvas);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
navigation.createPellicule = function(){
    for (var i=0; i<tab_name.length; i++){
        navigation.pellicule.list.push(struct.createGraph(tab_name[i], null, null, null));
    }
    const img = document.createElement("img");

    for (var i = 0; i < navigation.pellicule.list.length; i++){
        img.src = navigation.pellicule.list[i].uri;
        const pelliculeHtml = document.getElementById("pellicule");
        var string = '<div id="vignetteContainer" style=" display:inline-block ; height=100% width=20%"><canvas class="col-xs-2 img_pellicule"' + ' id="img_' + i  +'" ></canvas></div>';
        pelliculeHtml.innerHTML += string;

    }
    for (var i = 0; i < navigation.pellicule.list.length; i++){
        /*var canvas = document.getElementById("img_" + i);
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = navigation.pellicule.list[i].uri;
        image.onload = navigation.draw_image(image, ctx);*/
        navigation.initCanvas("img_" + i, i, navigation.pellicule.list[i].uri);

        //canvas.addEventListener("click", navigation.changeImgMainView(image, i));
        document.getElementById("img_" + i).style.zIndex = "1001";
        document.getElementById("img_" + i).addEventListener("click", navigation.changeImgMainView(navigation.pellicule.list[i].uri, i));
    }
};

navigation.draw_image = function(image, ctx){
    return function(){
        var height = getComputedStyle(document.getElementById("pellicule")).height;
        ctx.drawImage(image, 0, 0, parseInt(height) * 0.9, parseInt(height) * 0.9);
    }
};

navigation.maj_img_canvas = function(img, index){
    if (index != null){
        navigation.pellicule.currentIndex = index;
    }
    for (var i = 0; i < canvasList.length; i++){
        /*var canvas = document.getElementById(canvasList[i]);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        var image = new Image();
        image.src = img.src;
        image.onload = navigation.draw_image(image, ctx);*/
        print("image  " + img)
        navigation.initCanvas(canvasList[i], index, img)
    }
    //to wrap canvas in a Fabric canvas
    toolBox.initCanvas(index);
};
navigation.changeImgMainView = function(img, index){
    print("inclick");
    // pour les problèmes de closure
    return function () {
        navigation.maj_img_canvas(img, index);
    }
 };

navigation.onswipe = function(direction){
    if (direction=="left"){
        var graph = navigation.pellicule.next();
        var image = new Image();
        image.src = graph.uri;
        navigation.maj_img_canvas(image, null);
    }else if(direction =="right"){
        var graph = navigation.pellicule.previous();
        var image = new Image();
        image.src = graph.uri;
        navigation.maj_img_canvas(image, null);
    }
    toolBox.initCanvas(navigation.pellicule.currentIndex);
};

$('.bigImg').swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        navigation.onswipe(direction);
    }
});



navigation.createPellicule();
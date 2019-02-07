var navigation = {};
var print = console.log;
const name = "img/img_";
var tab_name = [];
for (var i=1; i<9; i++){
    tab_name.push(name+i+".png");
}
console.log(tab_name);

var canvasList=["img_home", "img_search", "img_filter", "img_annotation", "img_resume"];
var pellicule = new struct.Pellicule();

navigation.createPellicule = function(){
    for (var i=0; i<tab_name.length; i++){
        pellicule.list.push(struct.createGraph(tab_name[i], null, null, null));
    }
    const img = document.createElement("img");

    for (var i=0; i<pellicule.list.length; i++){
        img.src = pellicule.list[i].uri;
        const pelliculeHtml = document.getElementById("pellicule");
        pelliculeHtml.innerHTML += '<canvas class="col-xs-2 img_pellicule" id="img_' + i + '" ></canvas>';
    }
    for (var i=0; i<pellicule.list.length; i++){
        var canvas = document.getElementById("img_"+i);
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = pellicule.list[i].uri;
        image.onload = navigation.draw_image(image, ctx);
        canvas.addEventListener("click", navigation.changeImgMainView(image, i));
    }
};

navigation.draw_image = function(image, ctx){
    return function(){
        ctx.drawImage(image, 0, 0);
    }
};

navigation.maj_img_canvas = function(img, index){
    if (index != null){
        pellicule.currentIndex = index;
    }
    for (var i = 0; i < canvasList.length; i++){
        var canvas = document.getElementById(canvasList[i]);
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        var image = new Image();
        image.src = img.src;
        image.onload = navigation.draw_image(image, ctx);
    }
};
navigation.changeImgMainView = function(img, index){
    // pour les problèmes de closure
    return function () {
        navigation.maj_img_canvas(img, index);
    }
 };

navigation.onswipe = function(direction){
    if (direction=="left"){
        var graph = pellicule.next();
        var image = new Image();
        image.src = graph.uri;
        navigation.maj_img_canvas(image, null);
    }else if(direction =="right"){
        var graph = pellicule.previous();
        var image = new Image();
        image.src = graph.uri;
        navigation.maj_img_canvas(image, null);
    }
};

$('.bigImg').swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        navigation.onswipe(direction);
    }
});



navigation.createPellicule();
const name = "img/img_";
var tab_name = [];
for (var i=1; i<9; i++){
    tab_name.push(name+i+".png");
}
console.log(tab_name);

function createPellicule(){
    const img = document.createElement("img");
    for (var i=0; i<tab_name.length; i++){
        img.src = tab_name[i];
        const pellicule = document.getElementById("pellicule");
        pellicule.innerHTML += '<canvas class="col-xs-2 img_pellicule" id="img_' + i + '" ></canvas>';
    }
    for (var i=0; i<tab_name.length; i++){
        var canvas = document.getElementById("img_"+i);
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = tab_name[i];
        image.onload = draw_image(image, ctx);
    }
}

function draw_image(image, ctx){
    return function(){
        ctx.drawImage(image, 0, 0);
    }

}

createPellicule();
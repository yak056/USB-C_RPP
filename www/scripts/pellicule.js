const name = "img/img_";
var tab_name = [];
for (var i=1; i<14; i++){
    tab_name.push(name+i+".JPG");
}
console.log(tab_name);

function createPellicule(){
    const img = document.createElement("img");
    for (var i=0; i<tab_name.length; i++){
        img.src = tab_name[i];
        const pellicule = document.getElementById("pellicule");
        pellicule.innerHTML += '<div class="col-xs-2 img_pellicule" id="img_' + i + '"><img src="' + tab_name[i] + '"></div>';
    }
}

createPellicule();
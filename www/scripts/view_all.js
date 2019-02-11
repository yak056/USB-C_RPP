var view_all = {};


var searchBox = document.getElementById("search_1");
var alphabetic = true;
var alphabList = [];


for (var i = 0; i < navigation.pellicule.list.length; i++) {
    alphabList.push(navigation.pellicule.list[i].name.toLowerCase());
}
alphabList = alphabList.sort();
console.log(alphabList);

//code à optimiser, pas obligé de faire 2 fonctions on peut en faire qu'un avec les param de la recherche
view_all.createAllViewList = function () {
    const img = document.createElement("img");
    const allviewListHtml = document.getElementById("allviewList");
    for (var i = 0; i < navigation.pellicule.list.length; i++) {

        var colImg = document.createElement("div");
        colImg.setAttribute("class", "col-xs-2")
        img.src = navigation.pellicule.list[i].uri;
        var divImage = document.createElement("div");
        divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
        divImage.setAttribute("id", "yes-drop");

        var divWrapperImg = document.createElement("div");
        divWrapperImg.setAttribute("class", "imageVA");

        var imgThumbnail = document.createElement("img");
        imgThumbnail.setAttribute("src", img.src);
        var divTitle = document.createElement("div");
        divTitle.setAttribute("class", "caption");

        var titre = document.createTextNode(navigation.pellicule.list[i].name);
        divTitle.appendChild(titre);

        divWrapperImg.appendChild(imgThumbnail);
        divImage.appendChild(divWrapperImg);
        divImage.appendChild(divTitle);

        colImg.appendChild(divImage);
        allviewListHtml.appendChild(colImg);
    }
};

view_all.searchView = function () {
    const img = document.createElement("img");

    const allviewListHtml = document.getElementById("allviewList");
    while (allviewListHtml.firstChild) {
        allviewListHtml.removeChild(allviewListHtml.firstChild);
    }
    var search = document.getElementById("search_1").value;
    console.log(search);
    if (alphabetic) {
        for (var i = 0; i<alphabList.length;i++){
            for (var j = 0 ; j<navigation.pellicule.list.length; j++ ){
                if (navigation.pellicule.list[j].name.includes(alphabetic[i])) {
                    var colImg = document.createElement("div");
                    colImg.setAttribute("class", "col-xs-2")
                    img.src = navigation.pellicule.list[j].uri;
                    var divImage = document.createElement("div");
                    divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
                    divImage.setAttribute("id", "yes-drop");

                    var divWrapperImg = document.createElement("div");
                    divWrapperImg.setAttribute("class", "imageVA");

                    var imgThumbnail = document.createElement("img");
                    imgThumbnail.setAttribute("src", img.src);
                    var divTitle = document.createElement("div");
                    divTitle.setAttribute("class", "caption");

                    var titre = document.createTextNode(navigation.pellicule.list[j].name);
                    divTitle.appendChild(titre);

                    divWrapperImg.appendChild(imgThumbnail);
                    divImage.appendChild(divWrapperImg);
                    divImage.appendChild(divTitle);

                    colImg.appendChild(divImage);
                    allviewListHtml.appendChild(colImg);
                }
            }

        }
    } else {
        for (var i = 0; i < navigation.pellicule.list.length; i++) {
            if (navigation.pellicule.list[i].name.includes(search)) {
                var colImg = document.createElement("div");
                colImg.setAttribute("class", "col-xs-2")
                img.src = navigation.pellicule.list[i].uri;
                var divImage = document.createElement("div");
                divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
                divImage.setAttribute("id", "yes-drop");

                var divWrapperImg = document.createElement("div");
                divWrapperImg.setAttribute("class", "imageVA");

                var imgThumbnail = document.createElement("img");
                imgThumbnail.setAttribute("src", img.src);
                var divTitle = document.createElement("div");
                divTitle.setAttribute("class", "caption");

                var titre = document.createTextNode(navigation.pellicule.list[i].name);
                divTitle.appendChild(titre);

                divWrapperImg.appendChild(imgThumbnail);
                divImage.appendChild(divWrapperImg);
                divImage.appendChild(divTitle);

                colImg.appendChild(divImage);
                allviewListHtml.appendChild(colImg);
            }
        }
    }

};


view_all.createAllViewList();
searchBox.addEventListener('keyup', view_all.searchView);

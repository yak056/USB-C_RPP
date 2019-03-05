var view_all = {};


var searchBox = document.getElementById("search_1");
var toggleOrder = document.querySelector("input[name=alpha_1]");
document.getElementById('createGraphique').addEventListener('click', function () {
    if (nbSelected > 0) {
        view_all.createGraphique();
        view_all.createAllViewList();
    }
});
var alphabetic = false;
var alphabList = [];

//var de gestion du mode selection
var modeSelection = false;
var nbSelected = 0;
var idSelected = [];
var ignorClick = false;
//var d'affichage des graphiques créer
var createdGraphique = [];


var pressTimer;
view_all.createGraphique = function () {
    var listImage = [];
    var widht = 0;
    var height = 0;
    console.log(idSelected.length);
    for (i = 0; i < idSelected.length; i++) {
        listImage[i] = document.getElementById(idSelected[i]);
        console.log(document.getElementById(idSelected[i]).src);
    }
    var c = document.createElement("canvas");
    var ctx = c.getContext("2d");
    for (i = 0; i < listImage.length; i++) {
        widht = widht + listImage[i].width;
        height = height + listImage[i].height;

        ctx.drawImage(listImage[i], widht, 0, listImage[i].width, listImage[i].height);
    }
    createdGraphique[createdGraphique.length] = c;
    console.log(c);
    document.getElementById("outer-dropzone").appendChild(c);


};
/*document.getElementById('allviewList').addEventListener('click', function () {
    if (modeSelection) {
        modeSelection = false;
        for (i = 0; i < idSelected.length; i++) {
            document.getElementById(idSelected[i]).style.background = '#fff';
        }
        idSelected = [];
    }
});*/

view_all.removeSelectedId = function (id) {
    for (i = 0; i < idSelected.length; i++) {
        if (idSelected[i] == id) {
            idSelected.splice(i, 1);
        }
    }
};


view_all.setListenerLongPress = function (id) {
    var id = id;

    document.getElementById(id).addEventListener('click', function () {

        var number = rpp_connection.pellicule.getNumber(id);
        rpp_connection.pellicule.currentIndex = number;
        console.log(navigation.actualMainView);
        var page = "";
        if (navigation.actualMainView == "BCC_img_home") page = "home_view";
        else if (navigation.actualMainView == "BCC_img_filter") page = "filter_view";
        else if (navigation.actualMainView == "BCC_img_resume") {
            page = "resume_view";
            resume.init()
        } else if (navigation.actualMainView == "BCC_img_for_annotation") {
            page = "annotation_view";
            toolBox.initCanvas(rpp_connection.pellicule.currentIndex);

        } else if (navigation.actualMainView == null) {
            console.log("cooucou");
            page = "home_view";

        }
        navigation.changeDiv(page);
    });

    /* document.getElementById(id).addEventListener('mouseup', function () {
         clearTimeout(pressTimer);
         ignorClick = false;
         // Clear timeout
         return false;
     });
     document.getElementById(id).addEventListener('mousedown', function () {
             // Set timeout
             pressTimer = window.setTimeout(function () {

                 if (nbSelected < 6) {
                     modeSelection = true;
                     ignorClick = true;
                     nbSelected++;
                     idSelected.push("img_" + id);
                     var image = document.getElementById("img_" + id).cloneNode(true);
                     image.addEventListener("click", function () {
                         nbSelected--;
                         view_all.removeSelectedId(id);
                         document.getElementById(id).style.background = '#fff';
                         document.getElementById("outer-dropzone").removeChild(image);
                     });
                     image.setAttribute("class", "vignette_dropZone");
                     document.getElementById("outer-dropzone").appendChild(image);
                     document.getElementById(id).style.background = '#4e4';
                 }


             }, 500);
             return false;
         }
     )
     ;*/
}
;

view_all.sortPellicule = function(){
    for (var i = 0; i < rpp_connection.pellicule.list.length; i++) {
        alphabList.push(rpp_connection.pellicule.list[i].name.toLowerCase());
    }
    alphabList = alphabList.sort();
};



//code à optimiser, pas obligé de faire 2 fonctions on peut en faire qu'un avec les param de la recherche
view_all.createAllViewList = function () {
    const img = document.createElement("img");
    const allviewListHtml = document.getElementById("allviewList");
    while (allviewListHtml.firstChild) {
        allviewListHtml.removeChild(allviewListHtml.firstChild);
    }

    if (alphabetic) {
        var firstChar = "";
        for (var i = 0; i < alphabList.length; i++) {
            for (var j = 0; j < alphabList.length; j++) {
                console.log(rpp_connection.pellicule.list[j].name);
                if (rpp_connection.pellicule.list[j].name.toLowerCase() == (alphabList[i])) {
                    if (firstChar != alphabList[i].charAt(0)) {
                        var rowAlphab = document.createElement("div");
                        rowAlphab.setAttribute("class", "col-xs-12 letterRow");
                        firstChar = alphabList[i].charAt(0);
                        var divAlphab = document.createElement("div");
                        divAlphab.setAttribute("class", " letterList");

                        var h1FirstCar = document.createElement("h1");
                        h1FirstCar.innerText = firstChar.toUpperCase();
                        rowAlphab.appendChild(divAlphab);
                        divAlphab.appendChild(h1FirstCar);
                        allviewListHtml.appendChild(rowAlphab);
                    }

                    var colImg = document.createElement("div");
                    colImg.setAttribute("class", "col-xs-2");
                    img.src = rpp_connection.pellicule.list[j].uri;
                    var divImage = document.createElement("div");
                    divImage.setAttribute('class', 'thumbnail img-responsive ');
                    divImage.setAttribute("id", "" + rpp_connection.pellicule.list[i].name);


                    var divWrapperImg = document.createElement("div");
                    divWrapperImg.setAttribute("class", "imageVA");

                    var imgThumbnail = document.createElement("img");
                    imgThumbnail.setAttribute("src", img.src);
                    imgThumbnail.setAttribute("id", "img_" + rpp_connection.pellicule.list[i].name);


                    var divTitle = document.createElement("div");
                    divTitle.setAttribute("class", "caption");

                    var titre = document.createTextNode(rpp_connection.pellicule.list[j].name);

                    divTitle.appendChild(titre);
                    divWrapperImg.appendChild(imgThumbnail);
                    divImage.appendChild(divWrapperImg);
                    divImage.appendChild(divTitle);
                    colImg.appendChild(divImage);
                    allviewListHtml.appendChild(colImg);
                    view_all.setListenerLongPress("" + rpp_connection.pellicule.list[i].name);

                }
            }
        }
    } else {
        for (var i = 0; i < rpp_connection.pellicule.list.length; i++) {

            var colImg = document.createElement("div");
            colImg.setAttribute("class", "col-xs-2")
            img.src = rpp_connection.pellicule.list[i].uri;
            var divImage = document.createElement("div");
            divImage.setAttribute('class', 'thumbnail img-responsive ');
            divImage.setAttribute("id", "" + rpp_connection.pellicule.list[i].name);


            var divWrapperImg = document.createElement("div");
            divWrapperImg.setAttribute("class", "imageVA");

            var imgThumbnail = document.createElement("img");
            imgThumbnail.setAttribute("src", img.src);
            imgThumbnail.setAttribute("id", "img_" + rpp_connection.pellicule.list[i].name);


            var divTitle = document.createElement("div");
            divTitle.setAttribute("class", "caption");

            var titre = document.createTextNode(rpp_connection.pellicule.list[i].name);
            divTitle.appendChild(titre);

            divWrapperImg.appendChild(imgThumbnail);
            divImage.appendChild(divWrapperImg);
            divImage.appendChild(divTitle);

            colImg.appendChild(divImage);
            allviewListHtml.appendChild(colImg);
            view_all.setListenerLongPress("" + navigation.pellicule.list[i].name);


        }
        if (createdGraphique.length > 0) {
            view_all.createOthers();
        }
    }
};

view_all.createOthers = function () {
    const allviewListHtml = document.getElementById("allviewList");

    for (var i = 0; i < createdGraphique.length; i++) {

        var colImg = document.createElement("div");
        colImg.setAttribute("class", "col-xs-2")

        var divImage = document.createElement("div");
        divImage.setAttribute('class', 'thumbnail img-responsive ');
        divImage.setAttribute("id", "" + createdGraphique.length);


        var divWrapperImg = document.createElement("div");
        divWrapperImg.setAttribute("class", "imageVA");

        var imgThumbnail = createdGraphique[i];
        imgThumbnail.setAttribute("id", "img_" + i);


        var divTitle = document.createElement("div");
        divTitle.setAttribute("class", "caption");

        var titre = document.createTextNode(i);
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
    if (search == "" || search == null) {
        view_all.createAllViewList();
        console.log("recherche :" + search);
    } else {
        for (var i = 0; i < rpp_connection.pellicule.list.length; i++) {
            var length = search.length;
            console.log( "search" + search);
            console.log("chaine recherchée" + rpp_connection.pellicule.list[i].name.toLowerCase().substring(0, length));
            if (rpp_connection.pellicule.list[i].name.toLowerCase().substring(0, length) == search.toLowerCase()) {
                var colImg = document.createElement("div");
                colImg.setAttribute("class", "col-xs-2");
                img.src = rpp_connection.pellicule.list[i].uri;
                var divImage = document.createElement("div");
                divImage.setAttribute('class', 'thumbnail img-responsive ');
                divImage.setAttribute("id", "" + navigation.pellicule.list[i].name);


                var divWrapperImg = document.createElement("div");
                divWrapperImg.setAttribute("class", "imageVA");

                var imgThumbnail = document.createElement("img");
                imgThumbnail.setAttribute("src", img.src);
                imgThumbnail.setAttribute("id", "img_" + rpp_connection.pellicule.list[i].name);

                var divTitle = document.createElement("div");
                divTitle.setAttribute("class", "caption");

                var titre = document.createTextNode(rpp_connection.pellicule.list[i].name);
                divTitle.appendChild(titre);

                divWrapperImg.appendChild(imgThumbnail);
                divImage.appendChild(divWrapperImg);
                divImage.appendChild(divTitle);
                colImg.appendChild(divImage);
                allviewListHtml.appendChild(colImg);
                view_all.setListenerLongPress("" + rpp_connection.pellicule.list[i].name);

            }
        }
    }
};
view_all.changeOrder = function (checkbox) {
    console.log(checkbox.checked);
    alphabetic = checkbox.checked;
    view_all.createAllViewList();
};

searchBox.addEventListener('keyup', view_all.searchView);


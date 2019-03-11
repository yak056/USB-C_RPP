// ===================================
// = Javascript de la vue galerie =
// ===================================

var view_all = {};


// ===================================
// = Declaration des variables       =
// ===================================

//récupération des node des objet de l'interface
var searchBox = document.getElementById("search_1");
var toggleOrder = document.querySelector("input[name=alpha_1]");


//var pour ordre alphabetic
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

// ===================================
// = Declaration des fonctions       =
// ===================================

//creer un graphique par la fusion de plusieurs graphique
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

//enleve un graphique selectionné de la zone de fusion
view_all.removeSelectedId = function (id) {
    for (i = 0; i < idSelected.length; i++) {
        if (idSelected[i] == id) {
            idSelected.splice(i, 1);
        }
    }
}

//Met en place les differents listenner sur les graphique( par id)
view_all.setListenerLongPress = function (id) {
    var id = id;

    document.getElementById(id).addEventListener('click', function () {

        var number = navigation.pellicule.getNumber(id);
        navigation.pellicule.currentIndex = number;
        console.log(navigation.actualMainView);
        var page = "";
        if (navigation.actualMainView == "BCC_img_home") page = "home_view";
        else if (navigation.actualMainView == "BCC_img_filter") page = "filter_view";
        else if (navigation.actualMainView == "BCC_img_resume") {
            page = "resume_view";
            resume.init()
        } else if (navigation.actualMainView == "BCC_img_for_annotation") {
            page = "annotation_view";
            toolBox.initCanvas(navigation.pellicule.currentIndex);

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
};

//Classe la pellicule par liste alphabetique
view_all.sortPellicule = function () {
    for (var i = 0; i < navigation.pellicule.list.length; i++) {
        alphabList.push(navigation.pellicule.list[i].name.toLowerCase());
    }
    alphabList = alphabList.sort();
};

//Creer la vue de liste de graphique soit par ordre alphabetique soit pellicule
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
                if (navigation.pellicule.list[j].name.toLowerCase() == (alphabList[i])) {
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
                    img.src = navigation.pellicule.list[j].uri;
                    var divImage = document.createElement("div");
                    divImage.setAttribute('class', 'thumbnail img-responsive ');
                    divImage.setAttribute("id", "" + navigation.pellicule.list[i].name);


                    var divWrapperImg = document.createElement("div");
                    divWrapperImg.setAttribute("class", "imageVA");

                    var imgThumbnail = document.createElement("img");
                    imgThumbnail.setAttribute("src", img.src);
                    imgThumbnail.setAttribute("id", "img_" + navigation.pellicule.list[i].name);


                    var divTitle = document.createElement("div");
                    divTitle.setAttribute("class", "caption");

                    var titre = document.createTextNode(navigation.pellicule.list[j].name);

                    divTitle.appendChild(titre);
                    divWrapperImg.appendChild(imgThumbnail);
                    divImage.appendChild(divWrapperImg);
                    divImage.appendChild(divTitle);
                    colImg.appendChild(divImage);
                    allviewListHtml.appendChild(colImg);
                    view_all.setListenerLongPress("" + navigation.pellicule.list[i].name);

                }
            }
        }
    } else {
        for (var i = 0; i < navigation.pellicule.list.length; i++) {

            var colImg = document.createElement("div");
            colImg.setAttribute("class", "col-xs-2")
            img.src = navigation.pellicule.list[i].uri;
            var divImage = document.createElement("div");
            divImage.setAttribute('class', 'thumbnail img-responsive ');
            divImage.setAttribute("id", "" + navigation.pellicule.list[i].name);


            var divWrapperImg = document.createElement("div");
            divWrapperImg.setAttribute("class", "imageVA");

            var imgThumbnail = document.createElement("img");
            imgThumbnail.setAttribute("src", img.src);
            imgThumbnail.setAttribute("id", "img_" + navigation.pellicule.list[i].name);


            var divTitle = document.createElement("div");
            divTitle.setAttribute("class", "caption");

            var titre = document.createTextNode(navigation.pellicule.list[i].name);
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
//Affiche les graphiques fusionnés
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
}
//Affiche les graphique correspondant à la recherche
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
        for (var i = 0; i < navigation.pellicule.list.length; i++) {
            var length = search.length;
            console.log("search" + search);
            console.log("chaine recherchée" + navigation.pellicule.list[i].name.toLowerCase().substring(0, length));
            if (navigation.pellicule.list[i].name.toLowerCase().substring(0, length) == search.toLowerCase()) {
                var colImg = document.createElement("div");
                colImg.setAttribute("class", "col-xs-2");
                img.src = navigation.pellicule.list[i].uri;
                var divImage = document.createElement("div");
                divImage.setAttribute('class', 'thumbnail img-responsive ');
                divImage.setAttribute("id", "" + navigation.pellicule.list[i].name);


                var divWrapperImg = document.createElement("div");
                divWrapperImg.setAttribute("class", "imageVA");

                var imgThumbnail = document.createElement("img");
                imgThumbnail.setAttribute("src", img.src);
                imgThumbnail.setAttribute("id", "img_" + navigation.pellicule.list[i].name);

                var divTitle = document.createElement("div");
                divTitle.setAttribute("class", "caption");

                var titre = document.createTextNode(navigation.pellicule.list[i].name);
                divTitle.appendChild(titre);

                divWrapperImg.appendChild(imgThumbnail);
                divImage.appendChild(divWrapperImg);
                divImage.appendChild(divTitle);
                colImg.appendChild(divImage);
                allviewListHtml.appendChild(colImg);
                view_all.setListenerLongPress("" + navigation.pellicule.list[i].name);

            }
        }
    }

};
//Change l'ordre de la liste des graphiques
view_all.changeOrder = function (checkbox) {
    console.log(checkbox.checked);
    alphabetic = checkbox.checked;
    view_all.createAllViewList();
};
// ===================================
// = Ajout des events                =
// ===================================
//Met le listenner sur le bouton de creation de fusion de grpahique
document.getElementById('createGraphique').addEventListener('click', function () {
    if (nbSelected > 0) {
        view_all.createGraphique();
        view_all.createAllViewList();
    }
});
//Met le listenner sur la searchbox lors du lever de touche
searchBox.addEventListener('keyup', view_all.searchView);

// ===================================
// = Execution des scripts           =
// ===================================
view_all.sortPellicule();
view_all.createAllViewList();

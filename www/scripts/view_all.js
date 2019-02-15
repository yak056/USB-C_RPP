var view_all = {};


var searchBox = document.getElementById("search_1");
var toggleOrder = document.querySelector("input[name=alpha_1]");
var alphabetic = false;
var alphabList = [];
var modeSelection = false;

var pressTimer;

view_all.setListenerLongPress = function (id) {
    console.log("coucou  ");
    var id = id;
    console.log(document.getElementById(id));

    document.getElementById(id).addEventListener('mouseup', function () {
        console.log(id);

        clearTimeout(pressTimer);
        // Clear timeout
        return false;
    });
    document.getElementById(id).addEventListener('mousedown', function () {
        // Set timeout
        pressTimer = window.setTimeout(function () {
            console.log("coucou coucouc ocuoucou");
            modeSelection = true;

            document.getElementById(id).style.background = 'blue';

        }, 500);
        return false;
    });
};


for (var i = 0; i < navigation.pellicule.list.length; i++) {
    alphabList.push(navigation.pellicule.list[i].name.toLowerCase());
}
alphabList = alphabList.sort();

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
                    divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
                    divImage.setAttribute("id", "thumbnail_" + navigation.pellicule.list[i].name);


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
                    view_all.setListenerLongPress("thumbnail_" + navigation.pellicule.list[i].name);

                }
            }
        }
    } else {
        for (var i = 0; i < navigation.pellicule.list.length; i++) {

            var colImg = document.createElement("div");
            colImg.setAttribute("class", "col-xs-2")
            img.src = navigation.pellicule.list[i].uri;
            var divImage = document.createElement("div");
            divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
            divImage.setAttribute("id", "thumbnail_" + navigation.pellicule.list[i].name);


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
            view_all.setListenerLongPress("thumbnail_" + navigation.pellicule.list[i].name);

        }
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
        for (var i = 0; i < navigation.pellicule.list.length; i++) {
            if (navigation.pellicule.list[i].name.toLowerCase().startsWith(search.toLowerCase())) {
                var colImg = document.createElement("div");
                colImg.setAttribute("class", "col-xs-2");
                img.src = navigation.pellicule.list[i].uri;
                var divImage = document.createElement("div");
                divImage.setAttribute('class', 'thumbnail img-responsive drag-drop');
                divImage.setAttribute("id", "thumbnail_" + navigation.pellicule.list[i].name);


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
                view_all.setListenerLongPress("thumbnail_" + navigation.pellicule.list[i].name);

            }
        }
    }

};
view_all.changeOrder = function (checkbox) {
    console.log(checkbox.checked);
    alphabetic = checkbox.checked;
    view_all.createAllViewList();
};


view_all.createAllViewList();
searchBox.addEventListener('keyup', view_all.searchView);




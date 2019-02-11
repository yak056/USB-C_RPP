navbar = {};
navbar.actualMainView = ""; // in order to know wich is the displayed mainView

document.getElementById("ConnexionMenu").focus();

$('.btn-expand-collapse').click(function(e) {
    $('.navbar-primary').toggleClass('collapsed');
    $('.btn-expand-collapse').find("span").toggleClass('glyphicon-menu-left').toggleClass('glyphicon-menu-right');
});

$('.navbar-primary').swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        if (direction=="left" && !$('.navbar-primary').hasClass('collapsed')){
            $('.navbar-primary').toggleClass('collapsed');
            $('.btn-expand-collapse').find("span").toggleClass('glyphicon-menu-left').toggleClass('glyphicon-menu-right');
        }
        if (direction=="right" && $('.navbar-primary').hasClass('collapsed')){
            $('.navbar-primary').toggleClass('collapsed');
            $('.btn-expand-collapse').find("span").toggleClass('glyphicon-menu-right').toggleClass('glyphicon-menu-left');
        }
    }
});

navbar.changeDivReal = function(page){
    document.getElementById('connexion_view').hidden= true;
    document.getElementById('all_view').hidden= true;
    document.getElementById('search_view').hidden= true;
    document.getElementById('filter_view').hidden= true;
    document.getElementById('resume_view').hidden= true;
    document.getElementById('annotation_view').hidden= true;
    document.getElementById('home_view').hidden= true;
    document.getElementById(page).hidden = false;
    if (page == "home_view") navbar.actualMainView = "BCC_img_home";
    else if (page == "search_view") navbar.actualMainView = "BCC_img_search";
    else if (page == "filter_view") navbar.actualMainView = "BCC_img_filter";
    else if (page == "resume_view") navbar.actualMainView = "BCC_img_resume";
    else if (page == "annotation_view") navbar.actualMainView = "BCC_img_for_annotation";
    //navbar.simulEvent(document.getElementById(page), "click");
    console.log(page);
    hidePellicule(page);
}
navbar.changeDiv = function(page){
    navbar.changeDivReal(page);
    var graph = navigation.pellicule.list[i];
    var image = new Image();
    image.src = graph.uri;
    var index = navigation.pellicule.currentIndex
    navigation.changeImgMainView(image, index);
}


function hidePellicule(page) {
    switch (page) {
        case 'all_view' :
            document.getElementById('pellicule').hidden = true;
            break;
        case 'connexion_view' :
            document.getElementById('pellicule').hidden = true;
            break;
        default:
            document.getElementById('pellicule').hidden = false;

    }
}

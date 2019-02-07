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
        }
        if (direction=="right" && $('.navbar-primary').hasClass('collapsed')){
            $('.navbar-primary').toggleClass('collapsed');
        }
    }
});

function changeDiv(page){
    document.getElementById('connexion_view').hidden= true;
    document.getElementById('all_view').hidden= true;
    document.getElementById('search_view').hidden= true;
    document.getElementById('filter_view').hidden= true;
    document.getElementById('resume_view').hidden= true;
    document.getElementById('annotation_view').hidden= true;
    document.getElementById('home_view').hidden= true;
    document.getElementById(page).hidden = false;
    console.log(page);
}

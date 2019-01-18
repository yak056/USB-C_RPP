var sidebar = document.getElementById("sidebar");
var state="deployed";
var touchendx, touchstartx;

$(document).ready(function () {
    $('#mysidebar').on('click', function () {
        if (state=="deployed"){
            state="collapsed";
            $('#sidebar').toggleClass('active', true);
            console.log("go to collapsed");
        }
        else if (state=="collapsed"){
            state="deployed";
            $('#sidebar').toggleClass('active', false);
            console.log("go to deployed");
        }
    });
});

sidebar.addEventListener('touchstart', function (event) {
    console.log("touch detect " + state);
    touchstartx =  event.touches[0].clientX;
}, false);

sidebar.addEventListener('touchend', function (event) {
    console.log("end detected");
    touchendx =  event.changedTouches[0].clientX;
    console.log("go to deployed " + touchstartx + " " + touchendx );
    if (touchendx-touchstartx<0){
        if (state=="deployed"){
            state="collapsed";
            $('#sidebar').toggleClass('active', true);
            console.log("go to collapsed");
        }
    }else{
        if (state=="collapsed"){
            state="deployed";
            $('#sidebar').toggleClass('active', false);
            console.log("go to deployed");
        }
    }
}, false);


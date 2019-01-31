var sidebar = document.getElementById("sidebar");
var sidebar_button = document.getElementById("sidebar_button");
var state="deployed";
var touchendx, touchstartx;

$(document).ready(function () {

    sidebar.addEventListener('touchstart', function (event) {
        console.log("touch detect " + event.srcElement.id);
        touchstartx =  event.touches[0].clientX;
        if (event.srcElement.id == "sidebar_button"){
            if (state=="deployed"){
                state="collapsed";
                $('#sidebar').toggleClass('active', true);
            }
            else if (state=="collapsed"){
                state="deployed";
                $('#sidebar').toggleClass('active', false);
            }

        }
        else {

        }
    }, false);

    sidebar.addEventListener('touchend', function (event) {
        touchendx =  event.changedTouches[0].clientX;
        if (touchendx-touchstartx<0 && event.srcElement.id != "sidebar_button"){
            if (state=="deployed"){
                state="collapsed";
                $('#sidebar').toggleClass('active', true);
            }
        }else{
            if (state=="collapsed"){
                state="deployed";
                $('#sidebar').toggleClass('active', false);
            }
        }
    }, false);
});



// ===================================
// = Javascript permettant le drag =
// = and drop                      =
// ===================================

var main_view = document.querySelector('all_view');
var zIndexRef;
//function sur les objet draggable
interact('.drag-drop', {
    context: main_view
})
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,

        onstart: dragStartListener,
        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            document.getElementById("allviewList").style.overflow ='scroll';

            event.target.style.zIndex = zIndexRef;
        }
    });
//fonction lors du drag
function dragMoveListener(event) {
    var interaction = event.interaction;
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;


    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
// fonction lors du début de drag
function dragStartListener(event) {
    document.getElementById("allviewList").style.overflow ='';

    var target = event.target;
    zIndexRef = target.style.zIndex;
    console.log(target.style.zIndex);
    target.style.display = 'none';
    target.style.zIndex = 9000;
    event.target.style.position = 'relative';
    target.style.display = '';
    console.log(target.style.zIndex);


}

//fonction de la zone de dépot (drop)
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:
    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.textContent = 'Dragged out';
    },
    ondrop: function (event) {
        event.relatedTarget.textContent = 'Dropped';
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});


// Ecouter les objets draggable sur la fenêtre entière
window.dragMoveListener = dragMoveListener;

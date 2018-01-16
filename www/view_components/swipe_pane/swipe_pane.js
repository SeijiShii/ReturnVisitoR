"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SwipePane = function(parent) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile    = returnvisitor.common.loadFile,
        elements    = returnvisitor.common.elements,
        Swipe       = returnvisitor.common.Swipe,
        paneFrame;

    function initialize() {
        loadFile.loadCss('./view_components/swipe_pane/swipe_pane.css');
        loadFile.loadHtmlAsElement('./view_components/swipe_pane/swipe_pane.html', function(div){
            paneFrame = div;

            // paneFrame.addEventListener('click', function(){

            // });

            initInnerFrame();

            parent.appendChild(paneFrame);
        });
    }

    function initInnerFrame() {

        var innerFrame = elements.getElementByClassName(paneFrame, 'inner_frame');

        var swipe = new Swipe(innerFrame);
        swipe.ySwipeEnabled = true;

        // innerFrame.addEventListener('touchstart', function(){
        //     console.log('Inner frame touch!');
        // }, false);
        // innerFrame.addEventListener('click', function(){
        //     console.log('Inner frame click!');
        // });

    }


    initialize();
} 
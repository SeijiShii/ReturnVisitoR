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

            parent.appendChild(paneFrame);
            initInnerFrame();
            
        });
    }

    function initInnerFrame() {

        var innerFrame = elements.getElementByClassName(paneFrame, 'inner_frame');

        var swipe = new Swipe(innerFrame);
        
        var originLeft = elements.positionInParent(innerFrame).left;
        var $frame = $(innerFrame)

        swipe.swipeStroke = paneFrame.clientWidth * 0.2;
        console.log('swipeStroke:', swipe.swipeStroke);

        swipe.onXSwipe = function(xStroke) {

            var oldLeft = elements.positionInParent(innerFrame).left;

            $frame.css({
                left : oldLeft + xStroke
            });
        }

        swipe.onXSwipeEnd = function(xStroke, speed) {

            var currentLeft = elements.positionInParent(innerFrame).left, 
                goalLeft,
                distance,
                time;
            
            if (xStroke > 0) {
                // Swipe to right.

                distance = Math.abs(currentLeft);
                time = distance / speed;

                $frame.animate({
                    left : 0
                }, time, function(){
                    $frame.css({
                        left : '-100%'
                    });
                });

            } else {
                // Swipe to left.

                goalLeft = innerFrame.clientWidth * -0.667;
                distance = Math.abs(goalLeft - currentLeft);

                time = distance / speed;

                $frame.animate({
                    left : '-200%'
                } , time, function(){
                    $frame.css({
                        left : '-100%'
                    });
                });
            }

        }

        swipe.onSwipeCancel = function() {
            $frame.animate({
                left : '-100%'
            } , 'slow');
        }


    }


    initialize();
} 
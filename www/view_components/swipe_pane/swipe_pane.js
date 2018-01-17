"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SwipePane = function(parent) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile    = returnvisitor.common.loadFile,
        elements    = returnvisitor.common.elements,
        Swipe       = returnvisitor.common.Swipe,
        paneFrame,
        innerFrame,
        centerPane,
        leftPane,
        rightPane,
        centerPaneCache;

    function initialize() {
        loadFile.loadCss('./view_components/swipe_pane/swipe_pane.css');
        loadFile.loadHtmlAsElement('./view_components/swipe_pane/swipe_pane.html', function(div){
            paneFrame = div;

            // paneFrame.addEventListener('click', function(){

            // });

            parent.appendChild(paneFrame);
            initInnerFrame();
            initContentPane();

            if (typeof _this.onPaneReady === 'function') {
                _this.onPaneReady();
            }
            
        });
    }

    function initInnerFrame() {

        innerFrame = elements.getElementByClassName(paneFrame, 'inner_frame');

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

                replaceWithCanvas(leftPane, function(cache){

                    $frame.animate({
                        left : 0
                    }, time, function(){
                        $frame.css({
                            left : '-100%'
                        });
                        setCacheToCenter(cache);
                        leftPane.innerHTML = '';
                        rightPane.innerHTML = centerPaneCache;
                    });
    
                });


            } else {
                // Swipe to left.

                goalLeft = innerFrame.clientWidth * -0.667;
                distance = Math.abs(goalLeft - currentLeft);

                time = distance / speed;

                replaceWithCanvas(rightPane, function(cache){
                    $frame.animate({
                        left : '-200%'
                    } , time, function(){
                        $frame.css({
                            left : '-100%'
                        });
    
                        setCacheToCenter(cache);
        
                        rightPane.innerHTML = '';
                        leftPane.innerHTML = centerPaneCache;
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

    function initContentPane() {

        centerPane = elements.getElementByClassName(paneFrame, 'center_pane');
        leftPane = elements.getElementByClassName(paneFrame, 'left_pane');
        rightPane = elements.getElementByClassName(paneFrame, 'right_pane');
    }



    this.shiftToRight = function() {

        console.log('shiftToRight')

        replaceWithCanvas(rightPane, function(cache){
            var $frame = $(innerFrame);
            $frame.animate({
                left : '-200%'
            }, 'slow' ,function(){
                $frame.css({
                    left : '-100%'
                });

                // console.log(cache);

                setCacheToCenter(cache);
    
                rightPane.innerHTML = '';
                leftPane.innerHTML = centerPaneCache;
            });
        });
    }

    this.shiftToLeft = function() {

        console.log('shiftToLeft')

        replaceWithCanvas(leftPane, function(cache){

            var $frame = $(innerFrame);
            $frame.animate({
                left : 0
            }, 'slow' ,function(){
                $frame.css({
                    left : '-100%'
                });

                setCacheToCenter(cache);
    
                leftPane.innerHTML = '';
                rightPane.innerHTML = centerPaneCache;
            });
        });
    }

    function setCacheToCenter(cache) {
        centerPaneCache = centerPane.innerHTML;
        centerPane.innerHTML = cache;
    }

    function setContent(pane, elm) {
        pane.innerHTML = '';
        pane.appendChild(elm);
    }

    this.setCenterContent = function(elm) {
        setContent(centerPane, elm);
    }

    this.setLeftContent = function(elm) {
        setContent(leftPane, elm);
    }

    this.setRightContent = function(elm) {
        setContent(rightPane, elm);
    }

    function replaceWithCanvas(pane, then2) {
        html2canvas(pane).then(function(canvas){
            $(canvas).css({
                position: 'absolute',
                top : 0,
                left : 0
            });

            var paneCache = pane.innerHTML;
            pane.innerHTML = '';
            pane.appendChild(canvas);  
            // console.log(cache);   

            then2(paneCache);
        });
    }

    initialize();
} 

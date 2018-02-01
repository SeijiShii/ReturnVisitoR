'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.SwipePane = function(parent) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common      = returnvisitor.common,
        loadFile    = common.loadFile,
        elements    = common.elements,
        SwipeElement = common.SwipeElement,
        paneFrame,
        innerFrame,
        ONE_THIRD = 100 / 3;

    function initialize() {
        loadFile.loadCss('./view_components/swipe_pane/swipe_pane.css');
        loadFile.loadHtmlAsElement('./view_components/swipe_pane/swipe_pane.html', function(div){
            paneFrame = div;

            parent.appendChild(paneFrame);
            initInnerFrame();
            waitForInnerFrameReadyCallbackReady();
            
        });
    }

    function waitForInnerFrameReadyCallbackReady() {

        var timerStartTime = new Date().getTime();
                
        var waitTimer = function() {

            var counter = new Date().getTime() - timerStartTime;

            if (counter > 500) {
                clearInterval(waitTimerId);
                throw new Error('ERROR_TIME_OUT: SwipePane inner frame takes more than 500ms to get ready!');
            }

            if ( typeof _this.onInnerFrameReady === 'function' ) {
                clearInterval(waitTimerId);
                _this.onInnerFrameReady();
            } 
            // console.log('SwipePane: waiting inner frame ready for ' + counter + 'ms');
        };

        var waitTimerId = setInterval(waitTimer, 20);
    }

    function initInnerFrame() {

        innerFrame = elements.getElementByClassName(paneFrame, 'inner_frame');

        var swipe = new SwipeElement(innerFrame,{
            swipeThru : true,
            frameCountX : 3,
            xSwipeEnabled : true,
            ySwipeEnabled : false
        });

        swipe.onEndSwipe = function(pos) {

            var $frame = $(innerFrame);

            $frame.css({
                left : '-100%'
            });

            shiftContentsInInnerFrame(parseInt(pos.left) != 0);
        };
    }

    this.animateToShowRightContent = function() {

        // console.log('animateToShowRightContent')

        var $frame = $(innerFrame);
        $frame.animate({
            left : '-200%'
        }, 'slow' ,function(){
            $frame.css({
                left : '-100%'
            });

            shiftContentsInInnerFrame(true);

        });
    };

    this.animateToShowLeftContent = function() {

        // console.log('animateToShowLeftContent')

        var $frame = $(innerFrame);
        $frame.animate({
            left : 0
        }, 'slow' ,function(){
            $frame.css({
                left : '-100%'
            });

            shiftContentsInInnerFrame(false);

        });
    };

    this.setContents = function(contents) {

        for ( var i = 0 ; i < 3 ; i++ ) {

            contents[i].style.left = ONE_THIRD * i + '%';
            contents[i].classList.add('content');
            innerFrame.appendChild(contents[i]);
        } 
    };

    this.getContent = function(index) {
        return innerFrame.children[index]; 
    };

    function shiftContentsInInnerFrame(toLeft) {

        if (toLeft) {

            // console.log('Shift to Left');
            // console.log(innerFrame.firstElementChild.date.toDateString());

            // Remove content in left.
            innerFrame.removeChild(innerFrame.firstElementChild);

            // console.log(innerFrame.firstElementChild.date.toDateString());
            
            // center one comes to first. and set to left.
            innerFrame.firstElementChild.style.left = 0;
            // Right one and so on.
            innerFrame.lastElementChild.style.left = ONE_THIRD + '%';

            if ( typeof _this.onShiftContentInInnerFrame === 'function' ) {
                var newContent = _this.onShiftContentInInnerFrame(innerFrame.lastElementChild, toLeft); 

                if (newContent === undefined) {
                    return;
                }

                newContent.style.left = ONE_THIRD * 2 + '%';
                newContent.classList.add('content');
                innerFrame.appendChild(newContent);
            }

           

        } else {
            // toRight

            // console.log('Shift to right')

            // console.log(innerFrame.lastElementChild.date.toDateString());

            innerFrame.removeChild(innerFrame.lastElementChild);
            innerFrame.firstElementChild.style.left = ONE_THIRD + '%';
            innerFrame.lastElementChild.style.left = ONE_THIRD * 2 + '%';

            if ( typeof _this.onShiftContentInInnerFrame === 'function' ) {
                var newContent = _this.onShiftContentInInnerFrame(innerFrame.firstElementChild, toLeft); 

                if (newContent === undefined) {
                    return;
                }
                
                newContent.style.left = 0;
                newContent.classList.add('content');
                innerFrame.insertBefore(newContent, innerFrame.firstElementChild);
            }

        }
    }

    initialize();
}; 

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
        centerPaneCache,
        ONE_THIRD = 33.333333333;

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
                throw new Error('ERROR_TIME_OUT: SwipePane inner frame takes more than 500ms to get ready!')
            }

            if ( typeof _this.onInnerFrameReady === 'function' ) {
                clearInterval(waitTimerId);
                _this.onInnerFrameReady();
            } 

            console.log('SwipePane: waiting inner frame ready for ' + counter + 'ms');
        }

        var waitTimerId = setInterval(waitTimer, 20);
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

                $frame.animate({
                    left : 0
                }, time, function(){
                    $frame.css({
                        left : '-100%'
                    });

                    shiftContentsInInnerFrame(false)
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

                    shiftContentsInInnerFrame(true);

                });
            }
        }

        swipe.onSwipeCancel = function() {
            $frame.animate({
                left : '-100%'
            } , 'slow');
        }
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

            // console.log(cache);

            shiftContentsInInnerFrame(true);

        });
    }

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
    }

    this.setContents = function(contents) {

        for ( var i = 0 ; i < 3 ; i++ ) {

            contents[i].style.left = ONE_THIRD * i + '%';
            contents[i].classList.add('content')
            innerFrame.appendChild(contents[i]);
        } 
    }

    this.getContent = function(index) {
        return innerFrame.children[index]; 
    }

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
                innerFrame.append(newContent);
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
                innerFrame.prepend(newContent);
            }

        }
    }

    initialize();
} 

"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.Swipe = function(target) {

    var _this = this,
        DEFAULT_STROKE = 50,
        startX,
        startY, 
        oldX,
        oldY,
        newX,
        newY,
        isSwiping = false;


    this.xSwipeEnabled = true;
    this.ySwipeEnabled = false;
    this.swipeStroke = DEFAULT_STROKE;

    target.addEventListener('touchstart', onTouchStart, false);
    target.addEventListener('touchmove', onTouchMove, false);
    target.addEventListener('touchend', handleEnd, false);

    target.addEventListener('mousedown', onMouseDown, false);
    target.addEventListener('mousemove', onMouseMove, false);
    target.addEventListener('mouseup', handleEnd, false);

    function onTouchStart(event) {
        
        // console.log(event);

        // これをすると子要素のクリックイベントが発火しなくなる。
        // event.preventDefault();

        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
        
        oldX = event.touches[0].pageX;
        oldY = event.touches[0].pageY;

        newX = event.touches[0].pageX;
        newY = event.touches[0].pageY;

        isSwiping = true;

    }

    function onMouseDown(event) {

        startX = event.screenX;
        startY = event.screenY;
        
        oldX = event.screenX;
        oldY = event.screenY;

        newX = event.screenX;
        newY = event.screenY;

        isSwiping = true;
    }

    function onTouchMove(event) {

        // これがないとtouchendイベントが発火しない。
        event.preventDefault();

        if (isSwiping) {
            oldX = newX;
            oldY = newY;
    
            newX = event.touches[0].pageX;
            newY = event.touches[0].pageY;
    
            handleMove();    
        }
    }

    function onMouseMove(event) {

        if (isSwiping) {
            oldX = newX;
            oldY = newY;
    
            newX = event.screenX;
            newY = event.screenY;
    
            handleMove();
        }
    }

    function handleMove() {

        var xStroke = newX - oldX,
            yStroke = newY - oldY;

        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {

            var stroke2D = Math.sqrt(Math.pow(xStroke, 2) + Math.pow(yStroke));

            console.log('2D Swipe: x: ' + xStroke + ' y: ' + yStroke);

            if ( typeof _this.on2DSwipe === 'function' ) {
                _this.on2DSwipe(xStroke, yStroke);
            }

        } else if (_this.xSwipeEnabled) {

            console.log('X Swipe: ' + xStroke);
            
            if ( typeof _this.onXSwipe === 'function' ) {
                _this.onXSwipe(xStroke);
            }

        } else if (_this.ySwipeEnabled) {

            console.log('Y Swipe: ' + yStroke);

            if ( typeof _this.onYSwipe === 'function' ) {
                _this.onYSwipe(yStroke);
            }
        }
    }

    function handleEnd() {

        isSwiping = false;

        var xStroke = newX - startX,
            yStroke = newY - startY;

        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {

            var stroke2D = Math.sqrt(Math.pow(xStroke, 2) + Math.pow(yStroke));

            if (stroke2D > _this.swipeStroke) {

                console.log('2D Swipe end: x: ' + xStroke + ' y: ' + yStroke);

                if ( typeof _this.on2DSwipe === 'function' ) {
                    _this.on2DSwipeEnd(xStroke, yStroke);
                }
            }

        } else if (_this.xSwipeEnabled) {
            
            if (xStroke > _this.swipeStroke) {

                console.log('X Swipe end: ' + xStroke);

                if ( typeof _this.onXSwipe === 'function' ) {
                    _this.onXSwipeEnd(xStroke);
                }
            }

        } else if (_this.ySwipeEnabled) {

            if (yStroke > _this.swipeStroke) {

                console.log('Y Swipe end: ' + yStroke);

                if ( typeof _this.onYSwipe === 'function' ) {
                    _this.onYSwipeEnd(yStroke);
                }
            }
        }

    }

}
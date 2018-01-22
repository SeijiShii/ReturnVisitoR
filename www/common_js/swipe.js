'use strict';
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
        startTime,
        isSwiping = false,
        isToBlockClick = false;


    this.xSwipeEnabled = true;
    this.ySwipeEnabled = false;
    this.swipeStroke = DEFAULT_STROKE;

    if (cordova.platformId == 'android') {

        target.addEventListener('touchstart', onTouchStart, {capture : false, passive : true});
        target.addEventListener('touchmove', onTouchMove, {capture : false, passive : true});
        target.addEventListener('touchend', handleEnd, false);
        target.addEventListener('touchcancel', onCancel, false);

    } else {

        target.addEventListener('mousedown', onMouseDown, false);
        target.addEventListener('mousemove', onMouseMove, false);
        target.addEventListener('mouseup', handleEnd, false);
        target.addEventListener('mouseleave', onCancel, false);
    
    }

    target.addEventListener('click', clickBlockLisntener, true);

    function onTouchStart(event) {
        
        // console.log(event);

        // これをすると子要素のクリックイベントが発火しなくなる。
        // event.preventDefault();

        startTime = new Date().getTime();

        startX = event.touches[0].pageX;
        startY = event.touches[0].pageY;
        
        oldX = event.touches[0].pageX;
        oldY = event.touches[0].pageY;

        newX = event.touches[0].pageX;
        newY = event.touches[0].pageY;

        isSwiping = true;

    }

    function onMouseDown(event) {


        startTime = new Date().getTime();

        startX = event.screenX;
        startY = event.screenY;
        
        oldX = event.screenX;
        oldY = event.screenY;

        newX = event.screenX;
        newY = event.screenY;

        isSwiping = true;
    }

    function onTouchMove(event) {

        // event.stopPropagation();

        // これがないとtouchendイベントが発火しない。
        event.preventDefault();

        if (isSwiping) {

            // console.log('Swipe touch start!');

            isToBlockClick = true;

            oldX = newX;
            oldY = newY;
    
            newX = event.touches[0].pageX;
            newY = event.touches[0].pageY;
    
            handleMove();    
        }
    }

    function onMouseMove(event) {
    
        if (isSwiping) {

            // addClickBlockListenerIfYet();
            isToBlockClick = true;

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

            // var stroke2D = Math.sqrt(Math.pow(xStroke, 2) + Math.pow(yStroke));

            // console.log('2D Swipe: x: ' + xStroke + ' y: ' + yStroke);

            if ( typeof _this.on2DSwipe === 'function' ) {
                _this.on2DSwipe(xStroke, yStroke);
            }

        } else if (_this.xSwipeEnabled) {

            // console.log('X Swipe: ' + xStroke);
            
            if ( typeof _this.onXSwipe === 'function' ) {
                _this.onXSwipe(xStroke);
            }

        } else if (_this.ySwipeEnabled) {

            // console.log('Y Swipe: ' + yStroke);

            if ( typeof _this.onYSwipe === 'function' ) {
                _this.onYSwipe(yStroke);
            }
        }
    }

    function handleEnd() {

    //   console.log('Touch up');

        isSwiping = false;
        var duration = new Date().getTime() - startTime,
            speed;

        var xStroke = newX - startX,
            yStroke = newY - startY;

        // console.log('xStroke: ' + xStroke + ', yStroke: ' + yStroke);

        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {

            var stroke2D = Math.sqrt(Math.pow(xStroke, 2) + Math.pow(yStroke, 2));

            // console.log('stroke2D:', stroke2D);

            if (Math.abs(stroke2D) > _this.swipeStroke) {

                // console.log('2D Swipe end: x: ' + xStroke + ' y: ' + yStroke);

                speed = Math.abs(stroke2D / duration);

                if ( typeof _this.on2DSwipeEnd === 'function' ) {
                    _this.on2DSwipeEnd(xStroke, yStroke, speed);
                }
            } else {
                if ( typeof _this.on2DSwipeCancel === 'function' ) {
                    _this.onSwipeCancel();
                }
            }

        } else if (_this.xSwipeEnabled) {
            
            if (Math.abs(xStroke) > _this.swipeStroke) {

                // console.log('X Swipe end: ' + xStroke);

                speed = Math.abs(xStroke / duration);
                // console.log('speed:', speed)

                if ( typeof _this.onXSwipeEnd === 'function' ) {
                    _this.onXSwipeEnd(xStroke, speed);
                }
            } else {
                if ( typeof _this.onSwipeCancel === 'function' ) {
                    _this.onSwipeCancel();
                }
            }

        } else if (_this.ySwipeEnabled) {

            if (Math.abs(yStroke) > _this.swipeStroke) {

                // console.log('Y Swipe end: ' + yStroke);

                speed = Math.abs(yStroke / duration);
                // console.log('speed:', speed)

                if ( typeof _this.onYSwipeEnd === 'function' ) {
                    _this.onYSwipeEnd(yStroke, speed);
                }
            } else {
                if ( typeof _this.onSwipeCancel === 'function' ) {
                    _this.onSwipeCancel();
                }
            }
        }
    }

    function onCancel() {
        isSwiping = false;
        if ( typeof _this.onSwipeCancel === 'function' ) {
            _this.onSwipeCancel();
        }
    }

    function clickBlockLisntener(e) {
        
        if (isToBlockClick) {
            e.stopPropagation();
            // console.log('Click killed!');
            isToBlockClick = false;
        }
        
    }


}
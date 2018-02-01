'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.Swipe = function(target, options) {

    var _this = this,
        swipeArray = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.Swipe.array,
        DEFAULT_STROKE = 50,
        startX,
        startY, 
        oldX,
        oldY,
        newX,
        newY,
        startTime,
        isSwiping = false,
        isToBlockClick = false,
        _startCallbackCalled = false,
        _blockOthersFlag = false;

    if (options) {
        this.swipeEnabled = options.swipeEnabled !==  undefined ? options.swipeEnabled : true ;
        this.xSwipeEnabled = options.xSwipeEnabled !== undefined ? options.xSwipeEnabled : true;
        this.ySwipeEnabled = options.ySwipeEnabled !== undefined ? options.ySwipeEnabled : true;
        this.swipeStroke = options.swipeStroke !== undefined ? options.swipeStroke : DEFAULT_STROKE;    
    } else {
        this.swipeEnabled =  true ;
        this.xSwipeEnabled = true;
        this.ySwipeEnabled = false;
        this.swipeStroke = DEFAULT_STROKE;
    
    }


    if (cordova.platformId == 'android') {

        target.addEventListener('touchstart', onTouchStart, {capture : false, passive : true});
        target.addEventListener('touchmove', onTouchMove, {capture : false, passive : true});
        target.addEventListener('touchend', handleEnd, false);
        target.addEventListener('touchcancel', handleEnd, false);

    } else {

        target.addEventListener('mousedown', onMouseDown, false);
        target.addEventListener('mousemove', onMouseMove, false);
        target.addEventListener('mouseup', handleEnd, false);
        target.addEventListener('mouseleave', handleEnd, false);
    
    }

    target.addEventListener('click', clickBlockLisntener, true);

    function onTouchStart(event) {

        if (!_this.swipeEnabled) {
            return;
        } 
        
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

        if (!_this.swipeEnabled) {
            return;
        }

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

        if (!_startCallbackCalled) {
            _startCallbackCalled = false;
            if (typeof _this.onSwipeStart === 'function' ) {
                _this.onSwipeStart();
            }
        }

        var stroke = {
            x : _this.xSwipeEnabled ? newX - oldX : 0,
            y : _this.ySwipeEnabled ? newY - oldY : 0, 
        };

        if (isPriorSwipe(stroke)) {
            
            if (!_blockOthersFlag) {
                _blockOthersFlag = true;
                swipeArray.blockOthers(_this);
            } 
        }

        if (!_this.swipeEnabled) {
            return;
        }

        var dist;
        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {

            dist = Math.sqrt(Math.pow(stroke.x, 2) + Math.pow(stroke.y));

        } else if (_this.xSwipeEnabled) {

            dist = stroke.x;

        } else if (_this.ySwipeEnabled) {

            dist = stroke.y;
        }

        stroke.distance = dist;

        if ( typeof _this.onSwipe === 'function' ) {
            _this.onSwipe(stroke);
        }

    }

    function handleEnd() {

        // console.log(e);
        
        if (!_this.swipeEnabled || !isSwiping) {
            return;
        }

        isSwiping = false;
        var duration = new Date().getTime() - startTime,
            speed;

        var xStroke = newX - startX,
            yStroke = newY - startY,
            dist;

        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {

            dist = Math.sqrt(Math.pow(xStroke, 2) + Math.pow(yStroke, 2));   

        } else if (_this.xSwipeEnabled) {

            dist = Math.abs(xStroke);

        } else if (_this.ySwipeEnabled) {

            dist = Math.abs(yStroke);

        }

        if (dist > _this.swipeStroke) {

            speed = Math.abs(dist / duration);

            var stroke = {
                x           : xStroke,
                y           : yStroke,
                distance    : dist,
                speed       : speed
            };

            if ( typeof _this.onSwipeEnd === 'function' ) {
                _this.onSwipeEnd(stroke);
            }

        } else {
            if ( typeof _this.onSwipeCancel === 'function' ) {
                _this.onSwipeCancel();
            }
        }

        swipeArray.recoverStatus();
        _blockOthersFlag = false;
    }

    this.cancel = function() {
        onCancel();
    };

    function onCancel() {
        
        if (!_this.swipeEnabled) {
            return;
        }

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

    function isPriorSwipe(stroke) {

        if (_this.xSwipeEnabled && _this.ySwipeEnabled) {
            return true;
        } else if (_this.xSwipeEnabled) {
            return Math.abs(stroke.x) > Math.abs(stroke.y);
        } else if (_this.ySwipeEnabled) {
            return Math.abs(stroke.y) > Math.abs(stroke.x);
        }
    }

    swipeArray.register(_this);
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.Swipe.array = (function(){

    var array = [],
        stateArray = [];

    return {
        register :     function(swipe){        
            array.push(swipe);        
        },

        blockOthers : function(swipe) {

            if (!swipe.swipeEnabled) {
                return;
            }

            for (var i = 0 ; i < array.length ; i++ ) {
                stateArray[i] = array[i].swipeEnabled;
                if (swipe !== array[i]) {                    
                    array[i].swipeEnabled = false;
                }
            }
        },

        recoverStatus : function() {

            for (var i = 0 ; i < array.length ; i++ ) {
                if (stateArray[i] !== undefined) {
                    array[i].swipeEnabled = stateArray[i];
                }
            }
        }
    }; 
})();

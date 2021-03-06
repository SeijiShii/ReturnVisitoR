'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.SwipeElement = function(target, options) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        Swipe           = common.Swipe,
        elements        = common.elements,
        waiter          = common.waiter,
        _target         = target,
        elm             = options.effectedElement !== undefined ? options.effectedElement : target,
        topLimit    = options.topLimit,
        bottomLimit = options.bottomLimit,
        leftLimit   = options.leftLimit,
        rightLimit  = options.rightLimit,
        _swipeStepX  = options.swipeStepX,
        _swipeStepY  = options.swipeStepY,         
        _frameCountX = options.frameCountX,
        _frameCountY = options.frameCountY,
        _swipeThru  = options.swipeThru !== undefined ? options.swipeThru : false,
        swipe;
    
    var parent = elm.parentNode;

    if (!parent) {
        throw new Error('Target is not appended to parent!');
    }

    elm.style.position = 'absolute';

    var originalPos = elements.positionInParent(elm),
        $elm = $(elm);

    swipe = new Swipe(_target, options);

    swipe.onSwipe = function(stroke) {

        if (!$(parent).css('position')) {
            throw new Error('Target parent must have style property "position" which is rightly set!');
        }

        var pos = elements.positionInParent(elm);
        var oldTop      = pos.top,
            oldLeft     = pos.left,
            oldBottom   = pos.bottom,
            oldRight    = pos.right,
            newTop      = oldTop + stroke.y,
            newLeft     = oldLeft + stroke.x,
            newBottom   = oldBottom - stroke.y,
            newRight    = oldRight - stroke.x;

        if ( newTop < topLimit ) {
            newTop = topLimit;
        }

        if ( newBottom < bottomLimit ) {
            newTop = parent.clientHeight - bottomLimit - _target.clientHeight;
        }

        if ( newLeft < leftLimit ) {
            newLeft = leftLimit;
        }

        if ( newRight < rightLimit ) {
            newLeft = parent.clientWidth - rightLimit - elm.clientWidth;
        }

        elm.style.left  = newLeft + 'px';
        elm.style.top   = newTop + 'px';
    };

    swipe.onSwipeEnd = function(stroke) {

        if (!_swipeThru) {
            return;
        }

        swipe.swipeEnabled = false;

        var currPos = elements.positionInParent(elm),
            goalLeft = currPos.left,  
            goalTop = currPos.top;

        if (stroke.x > 0) {

            goalLeft = parent.clientWidth - rightLimit - elm.clientWidth;
        } else if (stroke.x < 0) {
            
            goalLeft = leftLimit;
        }

        if (_swipeStepX) {
            goalLeft = goalLeft - parseInt((goalLeft - currPos.left) / _swipeStepX) * _swipeStepX;
        }

        if (stroke.y > 0) {
            goalTop = parent.clientHeight - bottomLimit - _target.clientHeight;

        } else if (stroke.y < 0) {
            goalTop = topLimit;
        }

        if (_swipeStepY) {
            goalTop = goalTop - parseInt((goalTop - currPos.top) / _swipeStepY) * _swipeStepY;
        }

        var dist = Math.sqrt(Math.pow(goalLeft - currPos.left, 2) + Math.pow(goalTop - currPos.top, 2));

        var time = dist * stroke.speed;

        $elm.animate({
            left : goalLeft,
            top : goalTop
        }, time, function(){

            originalPos = elements.positionInParent(elm);

            if ( typeof _this.onEndSwipe === 'function' ) {
                _this.onEndSwipe(elements.positionInParent(elm));
            }
            swipe.swipeEnabled = true;
        });
        
    };

    swipe.onSwipeCancel = function(callback) {

        if (_swipeThru) {
            $elm.animate({
                left : originalPos.left,
                top : originalPos.top
            }, 300, function(){

                if ( typeof callback === 'function' ) {
                    callback(elements.positionInParent(elm));
                }
            });
        }
    };

    function setLimit() {

        waiter.wait(function(){

            if (!topLimit) {
                topLimit = 0;
                if (elm.clientHeight > parent.clientHeight) {
                    topLimit = parent.clientHeight - elm.clientHeight;
                }
            }

            if (!bottomLimit) {
                bottomLimit = 0;
                if (elm.clientHeight > parent.clientHeight) {
                    bottomLimit = parent.clientHeight - elm.clientHeight;
                }
            }

            if (!leftLimit) {
                leftLimit = 0;
                if (elm.clientWidth > parent.clientWidth) {
                    leftLimit = parent.clientWidth - elm.clientWidth;
                }
            }

            if (!rightLimit) {
                rightLimit = 0;
                if (elm.clientWidth > parent.clientWidth) {
                    rightLimit = parent.clientWidth - elm.clientWidth;
                }
            }

            if (_frameCountX && !_swipeStepX) {
                _swipeStepX = elm.clientWidth / _frameCountX;
            }

            if (_frameCountY && !_swipeStepY) {
                _swipeStepY = elm.clientHeight / _frameCountY;
            }
        
        }, function(){
            return elm.clientWidth > 0 && elm.clientHeight > 0;
        });
    }

    setLimit();
        
};
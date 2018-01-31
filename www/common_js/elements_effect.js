'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elementsEffect = {

    shrink : function(elm) {
        var width = elm.clientWidth,
            height = elm.clientHeight,
            top = elm.top,
            left = elm.left,
            $elm = $(elm);

        $elm.animate({
            top : top + height * 0.1 + 'px',
            left : left + width * 0.1 + 'px',
            width : width * 0.8 + 'px',
            height : height * 0.8 + 'px'
        }, 100, function() {
            $elm.animate({
                top : top + 'px',
                left : left + 'px',
                width : width + 'px',
                height : height + 'px'
            }, 100);
        });
        
        
    },
    
    Blink : function(elm, enabled) {

        if (enabled === undefined) {
            enabled = true;
        }

        function changeOpacity(o) {
            elm.style.opacity = o;            
        }

        function onMouseDown() {
            changeOpacity(0.3);
        }

        function onMouseUp() {
            changeOpacity(1);
        }

        function onMouseEnter() {
            changeOpacity(0.6);
        }

        this.enable = function(enabled) {
            if (enabled) {
                elm.addEventListener('mousedown', onMouseDown, false);
                elm.addEventListener('mouseup', onMouseUp, false);
                elm.addEventListener('mouseleave', onMouseUp, false);
                elm.addEventListener('mouseenter', onMouseEnter, false);
        
                elm.addEventListener('touchstart', onMouseDown, {captuer : false, passive : true});
                elm.addEventListener('touchend', onMouseUp, {captuer : false, passive : true});
                elm.addEventListener('touchcancel', onMouseUp, {captuer : false, passive : true});
            } else {
                elm.removeEventListener('mousedown', onMouseDown);
                elm.removeEventListener('mouseup', onMouseUp);
                elm.removeEventListener('mouseleave', onMouseUp);
                elm.removeEventListener('mouseenter', onMouseEnter);
        
                elm.removeEventListener('touchstart', onMouseDown);
                elm.removeEventListener('touchend', onMouseUp);
                elm.removeEventListener('touchcancel', onMouseUp);
            }
        };

        this.enable(enabled);
    }
};
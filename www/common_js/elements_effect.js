'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elementsEffect = {
    // blink : function(elm) {
    //     var $elm = $(elm);
    //     $elm.fadeTo(100, 0.3, function(){
    //         $elm.fadeTo(100, 1);
    //     });
    // },

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
    
    blinker : function(elm) {

        elm.addEventListener('mousedown', onMouseDown, false);
        elm.addEventListener('mouseup', onMouseUp, false);
        elm.addEventListener('mouseleave', onMouseUp, false);
        elm.addEventListener('mouseenter', onMouseEnter, false);

        elm.addEventListener('touchstart', onMouseDown, {captuer : false, passive : true});
        elm.addEventListener('touchend', onMouseUp, {captuer : false, passive : true});
        elm.addEventListener('touchcancel', onMouseUp, {captuer : false, passive : true});

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
    }
};
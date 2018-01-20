"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elementsEffect = {
    blink : function(elm) {
        var $elm = $(elm);
        $elm.fadeTo(100, 0.3, function(){
            $elm.fadeTo(100, 1);
        });
    },

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
                }, 100)
            })
        
        
    }
}
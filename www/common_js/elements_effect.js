"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elementsEffect = {
    blink : function(elm) {
        $(elm).fadeTo(100, 0.3, function(){
            $(elm).fadeTo(100, 1);
        });
    }
}
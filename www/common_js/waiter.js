'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.waiter = {
    wait : function(waitFunc, conditionFunc) {

        var count = 0,
            STEP = 20,
            LIMIT = 500;
            
        var wait = function(){

            if (conditionFunc()) {
                clearInterval(timerId);
                waitFunc();
                return;
            }

            if (count > LIMIT) {
                clearInterval(timerId);
                console.trace();
                throw new Error('Waiter is waiting over than ' + LIMIT + 'ms.');
            }

            count += STEP;
        };

        var timerId = setInterval(wait, STEP);
    }
};
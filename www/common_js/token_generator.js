"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.tokenGenerator = (function(){
    return {
        generateToken : function() {
            var milSec = new Date().valueOf();
        var idCounterString = ('0000' + parseInt(Math.random() * 1000)).slice(-4);

        return milSec + idCounterString;
        }
    }
})();
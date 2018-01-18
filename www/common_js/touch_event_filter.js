"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.touchEventFilter = (function(){

    function _getTarget(event, className) {
        if (cordova.platformId === 'android') {

            return event.currentTarget;

        } else {
            for ( var i = 0 ; i < event.path.length ; i++ ) {
                var elm = event.path[i];
                if (elm.classList !== undefined) {
                    if (elm.classList.contains(className)) {  
                        return elm;
                    }            
                }
            }  
        }
    }

    return {
        getTarget : _getTarget,
    
        getTargetId : function(event, className) {

            return _getTarget(event, className).id;
        }
    }

})()
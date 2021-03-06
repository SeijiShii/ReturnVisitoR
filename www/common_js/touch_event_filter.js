'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.touchEventFilter = (function(){

    function _getTarget(event, className) {

        if (className === undefined) {
            throw new Error('Argument "className" must not be blank!');
        }

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
    
    function _touchToPosition(evt) {

        if (cordova.platformId === 'android') {

            var touch = evt.touches[0];

            return {
                x : touch.pageX,
                y : touch.pageY
            };
            
        } else {

            return {
                x : evt.clientX,
                y : evt.clientY
            };
        }
    }

    return {
        getTarget : _getTarget,
    
        getTargetId : function(event, className) {

            return _getTarget(event, className).id;
        },

        touchToPosition : _touchToPosition,
    };

})();
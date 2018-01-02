"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements = (function(){

 
    return {
        getAllOffspring : function(element) {

            var offspring = [];

            var pushOffspring = function(_element) {
                var children = _element.children;
                // console.log(children);

                var array = Array.prototype.slice.call(children);
                // console.log(array);
                
                for ( var i = 0 ; i < array.length ; i++ ) {
                    if (array[i] !== undefined) {
                        offspring.push(array[i]);
                        pushOffspring(array[i]);
                    }
                } 
            } 

            pushOffspring(element);

            return offspring;

        },

        getElementById : function(parent, id) {
            var offspring = this.getAllOffspring(parent);

            for ( var i = 0 ; i < offspring.length ; i++ ) {
                if ( offspring[i].id === id ) {
                    return offspring[i];
                }
            }
        }
    }
}());
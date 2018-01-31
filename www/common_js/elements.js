"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.elements = (function(){

 
    return {
        getAllOffspring : function(element) {

            var offspring = [];

            var pushOffspring = function(_element) {

                if (_element === undefined) {
                    return;
                }
                
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
            } ;

            pushOffspring(element);

            return offspring;

        },

        /**
         * @param parent Parent element to search child element into.
         * @param id Element id to search for in the parent.
         */
        getElementById : function(parent, id) {
            var offspring = this.getAllOffspring(parent);

            for ( var i = 0 ; i < offspring.length ; i++ ) {
                if ( offspring[i].id === id ) {
                    return offspring[i];
                }
            }
        },

        getElementByClassName : function(parent, className) {
            var offspring = this.getAllOffspring(parent);

            for ( var i = 0 ; i < offspring.length ; i++ ) {

                var classList = offspring[i].classList;
                for ( var j = 0 ; j < classList.length ; j++ ) {

                    // console.log(classList[j]);
                    
                    if ( classList[j] === className ) {
                        return offspring[i];
                    }
                }

                
            }
        },

        positionInParent : function(element) {
            var rect = element.getBoundingClientRect();
            var parentRect = element.parentNode.getBoundingClientRect();

            return {
                top : rect.top - parentRect.top,
                left : rect.left - parentRect.left
            };
        }
    };
}());
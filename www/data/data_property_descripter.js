"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter =  {

    // 'keys' : {
    //     enumerable: false,
    //     get : function() {
    //         var array = [];
    //         Object.keys(this).forEach(function(key){
    //             array.push(key);
    //         }, this);
    //         return array;
    
    //     }
    // },

    'values' : {
        enumerable : false,
        get : function() {
            
            var array = [];
            
            this.keys.forEach(function(key){
                array.push(this[key]);
            }, this);
    
            return array;
        }
    },

    'getKeyByValue' : {
        enumerable : false,
        get : function(value) {
            Object.keys(this).forEach(function(key){
                if (this[key] === value) {
                    return key;
                }
            }, this)
        }
    }
}

'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject = function(idHeader){
    
    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        tokenGenrator = returnvisitor.common.tokenGenerator;

    this.id = idHeader + '_' + tokenGenrator.generateToken();
    this.timeStamp = new Date(); 

};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype.equals = function(otherObj) {
    return this.is === otherObj.id;
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype.clone = function() {

    var DataObject = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject,
        cloned = new DataObject();

    for (var prop in this) {

        if (typeof this[prop] !== 'function' ) {
            if (this[prop] instanceof Date) {

                cloned[prop] = new Date();
                cloned[prop].setTime(this[prop].getTime());
    
            } else if (this[prop] instanceof DataObject) {
                cloned[prop] = this[prop].clone();
            } else {
                cloned[prop] = this[prop];
            }
        }
    }
    return cloned;
};

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.fromDBData = function(dbData) {

//     var instance = new RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject();

//     instance.id = dbData.data_id;
//     instance.timeStamp.setTime(dbData.time_stamp);

//     return instance;
// };
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject = function(idHeader){
    // this.id = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype.generateId(idHeader);
    this.id = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.generateId(idHeader);
    console.log(this.id);

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject,
        writable: true
    }
})

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.idCounter = 0;

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.generateId = function(idHeader) {
    var dataObject = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject;
    var milSec = new Date().valueOf();
    var idCounterString = ('0000' + dataObject.idCounter).slice(-4);
    console.log('idCounter:', dataObject.idCounter)
    dataObject.idCounter += 1;
    if (dataObject.idCounter >= 10000) {
        dataObject.idCounter = 0;
    }
    console.log('idCounter:', dataObject.idCounter)

    return idHeader + '_' + milSec + idCounterString;
}
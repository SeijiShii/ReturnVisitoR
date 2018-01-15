RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject = function(idHeader){
    
    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        tokenGenrator = returnvisitor.common.tokenGenerator;

    this.id = idHeader + ' ' + tokenGenrator.generateToken();
    this.timeStamp = new Date(); 
    // console.log(this.id);

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype.equals = function(otherObj) {
    return this.is === otherObj.id;
}
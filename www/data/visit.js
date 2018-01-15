"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit = function(placeId){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'visit');
    
    this.placeId = placeId;
    this.dateTime = new Date();
    this.personVisitIds = [];
    this.placements = [];
    

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit
    }
})
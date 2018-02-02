'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement = function(visit, publication){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'placement');
    
    this.visit   = visit;
    this.publication = publication;
};


RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement.prototype.setDBData = function(dbData) {

    this.id = dbData.data_id;
    this.timeStamp.setTime(dbData.time_stamp);

    // this.category = dbData.category;
    // this.note = dbData.note;
};
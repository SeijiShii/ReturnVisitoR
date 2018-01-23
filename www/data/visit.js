'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit = function(place){

    var data = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data;

    data.DataObject.call(this, 'visit');
    
    this.place      = place;
    this.dateTime   = new Date();
    this.personVisits = [];
    this.placements = [];
    
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit
    }
});
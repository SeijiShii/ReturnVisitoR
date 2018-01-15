"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit = function(person, visitId){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'person_visit');
    
    this.personId = person.id;
    this.personData = person.data;
    this.interest = person.interest;
    this.visitId = visitId;
    this.isRV = false;
    this.isStudy = false;

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit
    }
})

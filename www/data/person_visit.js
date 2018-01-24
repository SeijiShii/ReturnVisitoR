'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit = function(person){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'person_visit');
    
    this.person = person;
    this.isRV = false;
    this.isStudy = false;

};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit
    }
});

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.PersonVisit.prototype.setDBData = function(dbData, callback) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        data = returnvisitor.data,
        Person = data.Person,
        common = returnvisitor.common,
        dbHelper = common.dbHelper,
        _this = this;

    this.id = dbData.data_id;
    this.timeStamp.setTime(dbData.time_stamp);

    this.isRV = dbData.is_rv;
    this.isStudy = dbData.is_study;

    dbHelper.loadPersonById(dbData.person_id, function(personData){

        _this.person = new Person;
        _this.person.setDBData(personData);

        if ( typeof callback === 'function' ) {
            callback();
        }
    });


};
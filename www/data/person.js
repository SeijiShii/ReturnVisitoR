"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person = function(){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this);
    this.sex = 0;
    this.age;
    this.interest;

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.Sex = [
    'UNKNOWN', 
    'MALE', 
    'FEMALE'
]

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.Age = [
    '_10',
    '11_20',
    '21_30',
    '31_40',
    '41_50',
    '51_60',
    '61_70',
    '71_80',
    '81_'
]

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.Interest = [
    'NONE',
    'NEGATIVE',
    'INDIFFERENT',
    'FAIR',
    'KIND',
    'INTERESTED',
    'STRONGLY_INTERESTED'
]

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person,
        writable: true
    }
})
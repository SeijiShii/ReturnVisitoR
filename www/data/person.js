"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person = function(){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this);
    this.sex = 0;
    this.age;
    this.interest;

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.sex = {
    UNKNOWN : 'Unknown',
    MALE    : 'Male',
    FEMALE  : 'Female'
} 

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.age = {
    AGE_10      : '~10',
    AGE_11_20   : '11~20',
    AGE_21_30   : '21~30',
    AGE_31_40   : '31~40',
    AGE_41_50   : '41~50',
    AGE_51_60   : '51~60',
    AGE_61_70   : '61~70',
    AGE_71_80   : '71~80',
    AGE_81_     : '81~'
} 

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.interest = {
    NONE                : 'None',
    NEGATIVE            : 'Negative',
    INDIFFERENT         : 'Indifferent',
    FAIR                : 'Fair',
    KIND                : 'Kind',
    INTERESTED          : 'Interested',
    STRONGLY_INTERESTED : 'Strongly Interested' 
} 

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person,
        writable: true
    }
})
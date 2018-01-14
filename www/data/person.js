"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person = function(){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'person');
    this.sex = 'SEX_UNKNOWN';
    this.age = 'AGE_UNKNOWN';
    this.interest = 'INTEREST_NONE';

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.sex = {
    SEX_UNKNOWN : 'Unknown',
    MALE    : 'Male',
    FEMALE  : 'Female'
} 

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.sex, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter)

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.age = {
    
    AGE_UNKNOWN : 'Unknown',
    AGE_10      : '~10',
    AGE_11_20   : '11~20',
    AGE_21_30   : '21~30',
    AGE_31_40   : '31~40',
    AGE_41_50   : '41~50',
    AGE_51_60   : '51~60',
    AGE_61_70   : '61~70',
    AGE_71_80   : '71~80',
    AGE_81_     : '81~'
};

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.age, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter)

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.interest = {
    INTEREST_NONE       : 'None',
    NEGATIVE            : 'Negative',
    INDIFFERENT         : 'Indifferent',
    TOO_BUSY            : 'Too Busy',
    FAIR                : 'Fair',
    KIND                : 'Kind',
    INTERESTED          : 'Interested',
    STRONGLY_INTERESTED : 'Strongly Interested' 
} 

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.interest, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter)

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person,
        writable: true
    },

    data : {
        set : undefined,
        get : function() {
            var s = '';
            if (this.name !== undefined && this.name.length > 0) {
                s = s + this.name + ' ';
            }

            s = s + RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.sex[this.sex] + ' ' + RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person.age[this.age];

            if (this.note !== undefined && this.note.length > 0) {
                s = s + ' ' + this.note;
            }

            return s;
        }
    }
})
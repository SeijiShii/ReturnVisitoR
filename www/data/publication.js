'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication = function(category){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'publication');
    
    this.category   = category;
    this.note = '';

    if (this.hasNumber) {
        var number = new Date();
        this.year = number.getFullYear();
        
        if (this.hasNumericNumber) {
            this.numericNumber = parseInt(number.getMonth() / 4) + 1;

        } else if (this.hasMonthNumber) {
            this.monthNumber = number.getMonth();
        }

    }

};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.category = {
    
    BIBLE           : 'Bible',
    BOOK            : 'Book',
    BROCHURE        : 'Brochure',
    TRACT           : 'Tract',
    WATCHTOWER      : 'WATCHTOWER',
    ST_WATCHTOWER   : 'Study WATCHTOWER',
    AWAKE           : 'Awake!',
    WEB_LINK        : 'Web Link',
    SHOW_VIDEO      : 'Showing Video',
    CONTACT_CARD    : 'Contact Card',
    OTHER           : 'Other'
};

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.category, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter);

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication,
        writable: true
    },

    data : {
        get : function() {

            var s = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.category[this.category];

            if (this.hasNumber) {

                var date = new Date();
                date.setFullYear(this.year);

                s = s + ' ' + date.yearString() + ' ';
                if (this.hasNumericNumber) {
                    s = s + 'No.' + this.numericNumber; 
                } else if (this.hasMonthNumber) {
                    date.setMonth(this.monthNumber);
                    s = s + date.monthString();
                }
            }

            if (this.note && this.note.length > 0) {
                s = s + ' ' + this.note;
            }
            return s;
        }
    },
    hasNumber : {
        get : function() {
            return this.hasNumericNumber || this.hasMonthNumber;
        }
    },

    hasNumericNumber : {
        get : function() {
            return this.category === 'WATCHTOWER' || this.category === 'AWAKE';
        
        }
    },

    hasMonthNumber: {
        get : function() {
            return this.category === 'ST_WATCHTOWER';
        }
    }
});

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype.setDBData = function(dbData) {

    this.id = dbData.data_id;
    this.timeStamp.setTime(dbData.time_stamp);

    this.category = dbData.category;
    this.note = dbData.note;
};


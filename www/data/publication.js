'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication = function(category){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'publication');
    
    this.category   = category;
    this.note = '';
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

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
//     constructor: {
//         configurable: true,
//         enumerable: true,
//         value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication,
//         writable: true
//     },
// });

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype.hasNumber = function(){
//     return this.hasNumericNumber || this.hasMonthNumber;
// };

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype.hasNumericNumber = function(){
//     return this.category === 'WATCHTOWER' || this.category === 'AWAKE';
// };

// RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype.hasMonthNumber = function(){
//     return this.category === 'ST_WATCHTOWER';
// };

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication,
        writable: true
    },

    data : {
        get : function() {

            var s = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Publication.category[this.age];

            if (this.note !== undefined && this.note.length > 0) {
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
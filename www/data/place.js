'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place = function(latLng, category){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor;
        
    returnvisitor.data.DataObject.call(this, 'place');
    
    this.latLng = latLng;
    if (!this.latLng) {
        this.latLng = {
            latitude: 0,
            longitude: 0
        };
    }

    this.category = category; 

    
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.category = {
    PLACE : 'Place', 
    ROOM : 'Room', 
    HOUSING_COMPLEX : 'Housing Complex'
};

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.category, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter);


RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place,
        writable: true
    },

    personIds : { 
        get : function() {
            return [];
        }
    },

});

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype.queryInterest = function(callback) {
        
    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common  = returnvisitor.common,
        dbHelper = common.dbHelper,
        data = returnvisitor.data,
        Visit = data.Visit;

    dbHelper.loadLastVisitToPlace(this, function(visitData){

        var lastVisit = new Visit();
        lastVisit.setDBData(visitData, function(){
            var interest = lastVisit.getInterest();

            if ( typeof callback === 'function' ) {
                callback(interest);
            }
        });
    });
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype.setDBData = function(dbData) {

    this.id = dbData.data_id;
    this.timeStamp.setTime(dbData.time_stamp);

    this.latLng.lat = dbData.latitude;
    this.latLng.lng = dbData.longitude;
    this.category = dbData.category;
    this.address = dbData.address;
};
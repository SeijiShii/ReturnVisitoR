'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place = function(latLng, category){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor;
        
    returnvisitor.data.DataObject.call(this, 'place');
    
    this.latLng = latLng;
    if (!this.latLng) {
        this.latLng = {
            lat: 0,
            lng: 0
        };
    }

    this.category = category; // place, housing_complex, room
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

        Visit.fromDBData(visitData, function(visit){
            var interest = visit.interest;

            if ( typeof callback === 'function' ) {
                callback(visit.place, interest);
            }
        });
    });
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.fromDBData = function(dbData) {

    var Place = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place,
        instance = new Place();
    
    instance.id = dbData.data_id;
    instance.timeStamp.setTime(dbData.time_stamp);

    instance.latLng.lat = dbData.latitude;
    instance.latLng.lng = dbData.longitude;
    instance.category = dbData.category;
    instance.address = dbData.address;

    return instance;
};
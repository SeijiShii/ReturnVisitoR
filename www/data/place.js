"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place = function(latLng, category){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'place');

    this.latLng = latLng;
    this.category = category; 
    this.address;
    this.personIds = []; // Person ids ever seen in this place.
    
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.category = {
    PLACE : 'Place', 
    ROOM : 'Room', 
    HOUSING_COMPLEX : 'Housing Complex'
}

Object.defineProperties(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.category, RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.dataPropertyDescripter)


RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place,
        writable: true
    }
})
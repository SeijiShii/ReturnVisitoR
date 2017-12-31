"use strict"

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place = function(latLng, category){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'place');

    this.latLng = latLng;
    this.address;
    this.category;
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.Category = [
    'PLACE', 'ROOM', 'HOUSING_COMPLEX'
]

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Place,
        writable: true
    }
})
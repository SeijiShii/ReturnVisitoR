'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit = function(place){

    var data = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data;

    data.DataObject.call(this, 'visit');
    
    this.place      = place;
    this.dateTime   = new Date();
    this.personVisits = [];
    this.placements = [];
    this.note = '';
    
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.prototype, {
    constructor : {
        value : RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit
    },

    interest : {
        get : function() {

            var bestPersonVisit = this.getBestPersonVisit();

            if (bestPersonVisit) {
                return bestPersonVisit.person.interest;
            } 
            return 'INTEREST_NONE';
        }
    }
});

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit.fromDBData = function(dbData, callback) {

    var returnvisitor   = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        dbHelper        = returnvisitor.common.dbHelper,
        data            = returnvisitor.data,
        Visit           = data.Visit,
        Place           = data.Place,
        PersonVisit     = data.PersonVisit,
        waiter          = returnvisitor.common.waiter,
        isPlaceReady = false,
        arePersonVisitsReady = false,
        arePlacementsReady = true,
        instance = new Visit();
    
    instance.id = dbData.data_id;
    instance.timeStamp.setTime(dbData.time_stamp);

    instance.dateTime.setTime(dbData.datetime);
    
    dbHelper.loadPlaceById(dbData.place_id, function(placeData){
        instance.place = Place.fromDBData(placeData);

        isPlaceReady = true;
    });

    dbHelper.loadPersonVisitsByVisitId(instance.id, function(personVisitRows){

        instance.personVisits = [];
        var count = 0;

        for (var i = 0 ; i < personVisitRows.length ; i++ ) {
            var personVisit = new PersonVisit();
            personVisit.setDBData(personVisitRows.item(i), function(){
                count++;
            });
            instance.personVisits.push(personVisit);
        }

        waiter.wait(function(){
            arePersonVisitsReady = true;
        }, function(){
            return count >= personVisitRows.length;
        });

    });

    // TODO: Set placements from daData.

    waiter.wait(function(){

        if ( typeof callback === 'function' ) {
            callback(instance);
        }

    }, function(){
        return isPlaceReady && arePersonVisitsReady && arePlacementsReady;
    });

};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Visit.prototype.getBestPersonVisit = function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        data = returnvisitor.data,
        Person = data.Person,
        personVisits = this.personVisits;

    if (personVisits.length <= 0) {
        return;
    }

    var bestPersonVisit = personVisits[0];
    if (personVisits.length == 1) {
        return bestPersonVisit;
    }

    for (var i = 1 ; i < personVisits.length ; i++ ) {
        
        if (Person.interest.indexOfKey(personVisits[i].person.interest) > Person.interest.indexOfKey(bestPersonVisit.person.interest)) {
            bestPersonVisit = personVisits[i];
        }
    }

    return bestPersonVisit;
};


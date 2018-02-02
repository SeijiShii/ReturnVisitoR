'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.dbHelper = (function(){

    var DB_NAME = 'returnvisitor_db',
        DB_VERSION = '1.0.0',
        DESCRIPTION = 'ReturnVisitorDB',
        estimatedSize = 2 * 1024 * 1024,
        PLACE_TABLE_NAME = 'place_table ',
        VISIT_TABLE_NAME = 'visit_table ',
        PERSON_TABLE_NAME = 'person_table ',
        PERSON_VISIT_TABLE_NAME = 'person_visit_table ',
        PUBLICATION_TABLE_NAME = 'publication_table ',
        PLACEMENT_TABLE_NAME = 'placement_table ',
        CREATE_TABLE_QUERY = 'CREATE TABLE ',
        DROP_TABLE_QUERY = 'DROP TABLE IF EXISTS ',
        INSERT_QUERY = 'INSERT INTO ',
        SELECT_ALL_QUERY = 'SELECT * FROM ',
        DELETE_QUERY = 'DELETE FROM ',
        BASIC_QUERY_COLUMNS = 'data_id, time_stamp, ',
        VALUES4 = 'VALUES ( ?, ?, ?, ? )',
        VALUES5 = 'VALUES ( ?, ?, ?, ?, ? )',
        VALUES6 = 'VALUES ( ?, ?, ?, ?, ?, ? )',
        VALUES7 = 'VALUES ( ?, ?, ?, ?, ?, ?, ? )',
        PLACE_INSERT_QUERY = INSERT_QUERY + PLACE_TABLE_NAME + VALUES6,
        VISIT_INSERT_QUERY = INSERT_QUERY + VISIT_TABLE_NAME + VALUES4,
        PERSON_INSERT_QUETY = INSERT_QUERY + PERSON_TABLE_NAME + VALUES5, 
        PERSON_VISIT_INSERT_QUETY = INSERT_QUERY + PERSON_VISIT_TABLE_NAME + VALUES6,
        PUBLICATION_INSERT_QUERY = INSERT_QUERY + PUBLICATION_TABLE_NAME + VALUES7,
        PLACEMENT_INSERT_QUERY = INSERT_QUERY + PLACEMENT_TABLE_NAME + VALUES4,
        WHERE_ID = 'WHERE data_id=? ',   
        database;
    
    function _initialize() {

        database = openDatabase(DB_NAME, DB_VERSION, DESCRIPTION, estimatedSize);
        database.transaction(function(txn){

            txn.executeSql(DROP_TABLE_QUERY + PLACE_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PLACE_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'category, latitude, longitude, address )');

            txn.executeSql(DROP_TABLE_QUERY + VISIT_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + VISIT_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'place_id, datetime )');

            txn.executeSql(DROP_TABLE_QUERY + PERSON_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PERSON_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'sex, age, interest )');

            txn.executeSql(DROP_TABLE_QUERY + PERSON_VISIT_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PERSON_VISIT_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'person_id, visit_id, is_rv, is_study )');

            txn.executeSql(DROP_TABLE_QUERY + PUBLICATION_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PUBLICATION_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'category, year, numeric_number, month_number, note )');

            txn.executeSql(DROP_TABLE_QUERY + PLACEMENT_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PLACEMENT_TABLE_NAME + '( ' + BASIC_QUERY_COLUMNS + 'visit_id, publication_id )');

        });
    }

    // Insert methods

   
    function _insertPlace(place) {

        database.transaction(function(txn){

            txn.executeSql(PLACE_INSERT_QUERY,[place.id, place.timeStamp.getTime(), place.category, place.latLng.lat, place.latLng.lng, place.address]);
        });
    }

    function _insertVisit(visit) {

        database.transaction(function(txn){

            txn.executeSql(VISIT_INSERT_QUERY, [visit.id, visit.timeStamp.getTime(), visit.place.id, visit.dateTime.getTime()]);
        });
    }

    function _insertPerson(person) {

        database.transaction(function(txn){

            txn.executeSql(PERSON_INSERT_QUETY, [person.id, person.timeStamp.getTime(), person.sex, person.age, person.interest ]);
        });
    }

    function _insertPersonVisit(personVisit, visitId) {

        database.transaction(function(txn){

            txn.executeSql(PERSON_VISIT_INSERT_QUETY, [personVisit.id, personVisit.timeStamp.getTime(), personVisit.person.id, visitId, personVisit.isRV, personVisit.isStudy ]);
        });
    }

    // InsertMultipleData

    // function _insertPersons(persons) {

    //     for ( var i = 0 ; i < persons.length ; i++ ) {
    //         _insertPerson(persons[i]);
    //     }
    // }

    // Update methods
    //      But not uses UPDATE but uses DELETE and INSERT

    function _updatePlace(place) {

        database.transaction(function(txn){

            txn.executeSql(DELETE_QUERY + PLACE_TABLE_NAME + WHERE_ID, [place.id], function(txn, result){
                // console.log(result);
                _insertPlace(place);
            }, function(e){
                // console.log(e);
            });
        });
    }

    function _updateVisit(visit) {

        _updatePlace(visit.place);

        for ( var i = 0 ; i < visit.personVisits.length ; i++ ) {
            _updatePersonVisit(visit.personVisits[i], visit.id);
        }

        database.transaction(function(txn){

            txn.executeSql(DELETE_QUERY + VISIT_TABLE_NAME + WHERE_ID, [visit.id], function(txn, result){
                // console.log(result);
                _insertVisit(visit);

            }, function(e){
                // console.log(e);
            });
        });
    }

    function _updatePerson(person) {

        database.transaction(function(txn){

            txn.executeSql(DELETE_QUERY + PERSON_TABLE_NAME + WHERE_ID, [person.id], function(txn, result){
                // console.log(result);
                _insertPerson(person);
            }, function(e){
                // console.log(e);
            });
        });
    }

    function _updatePersonVisit(personVisit, visitId) {

        _updatePerson(personVisit.person);
        
        database.transaction(function(txn){

            txn.executeSql(DELETE_QUERY + PERSON_TABLE_NAME + WHERE_ID, [personVisit.id], function(txn, result){
                // console.log(result);
                _insertPersonVisit(personVisit, visitId);
            }, function(e){
                // console.log(e);
            });
        });
    }

    //      multiple update
    
    function _updatePersons(persons) {

        for (var i = 0 ; i < persons.length ; i++ ) {
            _updatePerson(persons[i]);
        }
    }

    // Select methods
    //      Select single data

    function _loadDataById(id, callback, tableName) {

        database.transaction(function(txn){
            txn.executeSql(SELECT_ALL_QUERY + tableName + WHERE_ID, [id], function(txn, result){
                if (result.rows) {
                    callback(result.rows.item(0));
                }
            });
        }, function(e) {
            console.log(e);
        });

    }

    // Load place
    function _loadPlaceById(id, callback) {

        _loadDataById(id, callback, PLACE_TABLE_NAME);
    }

    function _loadPlaceByLatLng(latLng, callback) {

        database.transaction(function(txn){

            txn.executeSql(SELECT_ALL_QUERY + PLACE_TABLE_NAME + 'WHERE latitude = ? AND longitude = ?', [latLng.lat, latLng.lng], function(txn, result){
                
                var row;
                if (result.rows) {
                    row = result.rows.item(0);
                }

                callback(row);

            }, function(){
                
                console.log(arguments);
            });
        });
    }

    // Load visit
    function _loadVisitById(id, callback) {

        _loadDataById(id, callback, VISIT_TABLE_NAME);
    }

    function _loadPersonById(id, callback) {

        _loadDataById(id, callback, PERSON_TABLE_NAME);
    }

    //      Select all data

    function _loadAllData(callback, tableName) {

        database.transaction(function(txn){

            txn.executeSql(SELECT_ALL_QUERY + tableName, [], function(txn, result){
                if (result.rows) {
                    callback(result.rows);
                }
            }, function(e){
                console.log(e);
            });
        });        
    }

    function _loadAllPlaces(callback) {

        _loadAllData(callback, PLACE_TABLE_NAME);
    }
    
    function _loadAllVisitsToPlace(place, callback) {

        database.transaction(function(txn){

            txn.executeSql(SELECT_ALL_QUERY + VISIT_TABLE_NAME + 'WHERE place_id=? ', [place.id], function(txn, result){

                if (result.rows) {
                    callback(result.rows);
                }
            }, function(e){
                console.log(e);
            });
        });
    }

    function _loadLastVisitToPlace(place, callback) {

        database.transaction(function(txn){

            txn.executeSql(SELECT_ALL_QUERY + VISIT_TABLE_NAME + 'WHERE place_id = ? AND datetime = (SELECT MAX(datetime) FROM visit_table WHERE place_id = ?) ', [place.id, place.id], function(txn, result){

                var data;
                if (result.rows) {
                    data = result.rows.item(0);

                } else {
                    data = null;
                }
                callback(data);

            }, function(){
                console.log(arguments);
            });
        });
    }

    function _loadPersonVisitsByVisitId(visit, callback) {

        database.transaction(function(txn){

            txn.executeSql(SELECT_ALL_QUERY + PERSON_VISIT_TABLE_NAME + 'WHERE visit_id = ?',[visit.id], function(txn, result){
                
                callback(result.rows);

            }, function(){
                console.log(arguments);
            });
        });
    } 

    _initialize();

    return {

        updatePlace : _updatePlace,
        updateVisit : _updateVisit,
        updatePerson : _updatePerson, 

        updatePersons : _updatePersons,

        loadPlaceById : _loadPlaceById,
        loadVisitById : _loadVisitById,
        loadPersonById : _loadPersonById,

        loadPlaceByLatLng : _loadPlaceByLatLng,

        loadAllVisitsToPlace : _loadAllVisitsToPlace,
        loadLastVisitToPlace : _loadLastVisitToPlace,
        loadPersonVisitsByVisitId : _loadPersonVisitsByVisitId,
        loadAllPlaces : _loadAllPlaces

    };
    
})();
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
        PLACE_DATA_INSERT_QUERY = INSERT_QUERY + PLACE_TABLE_NAME + VALUES6,
        VISIT_DATA_INSERT_QUERY = INSERT_QUERY + VISIT_TABLE_NAME + VALUES4,
        PERSON_DATA_INSERT_QUETY = INSERT_QUERY + PERSON_TABLE_NAME + VALUES5, 
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

        });
    }

    // Insert methods

   
    function _insertPlace(place) {

        database.transaction(function(txn){

            txn.executeSql(PLACE_DATA_INSERT_QUERY,[place.id, place.timeStamp.getTime(), place.category, place.latLng.lat, place.latLng.lng, place.address]);
        });
    }

    function _insertVisit(visit) {

        database.transaction(function(txn){

            txn.executeSql(VISIT_DATA_INSERT_QUERY, [visit.id, visit.timeStamp.getTime(), visit.placeId, visit.dateTime.getTime()]);
        });
    }

    function _insertPerson(person) {

        database.transaction(function(txn){

            txn.executeSql(PERSON_DATA_INSERT_QUETY, [person.id, person.timeStamp.getTime(), person.sex, person.age, person.interest ]);
        });
    }

    // InsertMultipleData

    function _insertPersons(persons) {

        for ( var i = 0 ; i < persons.length ; i++ ) {
            _insertPerson(persons[i]);
        }
    }

    // Update methods
    //      But not uses UPDATE but uses DELETE and INSERT

    function _updatePerson(person) {

        database.transaction(function(txn){

            txn.executeSql(DELETE_QUERY + PERSON_TABLE_NAME + WHERE_ID, [person.id], function(txn, result){
                console.log(result);
                _insertPerson(person);
            }, function(e){
                console.log(e);
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
                    callback(result.rows[0]);
                }
            });
        }, function(e) {
            console.log(e);
        });

    }

    function _loadPlaceById(id, callback) {

        _loadDataById(id, callback, PLACE_TABLE_NAME);
    }

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

    _initialize();

    return {

        insertPlace : _insertPlace,
        insertVisit : _insertVisit,
        insertPerson : _insertPerson,
        insertPersons : _insertPersons,

        updatePerson : _updatePerson, 
        updatePersons : _updatePersons,

        loadPlaceById : _loadPlaceById,
        loadVisitById : _loadVisitById,
        loadPersonById : _loadPersonById,

        loadAllPlaces : _loadAllPlaces

    };
    
})();
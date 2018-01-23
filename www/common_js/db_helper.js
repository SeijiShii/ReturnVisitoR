'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.dbHelper = (function(){

    var DB_NAME = 'returnvisitor_db',
        DB_VERSION = '1.0.0',
        DESCRIPTION = 'ReturnVisitorDB',
        estimatedSize = 2 * 1024 * 1024,
        PLACE_TABLE_NAME = 'place_table',
        VISIT_TABLE_NAME = 'visit_table',
        PERSON_TABLE_NAME = 'person_table',
        PERSON_VISIT_TABLE_NAME = 'person_visit_table',
        PUBLICATION_TABLE_NAME = 'publication_table',
        PLACEMENT_TABLE = 'placement_table',
        CREATE_TABLE_QUERY = 'CREATE TABLE ',
        DROP_TABLE_QUERY = 'DROP TABLE IF EXISTS ',
        INSERT_QUERY = 'INSERT INTO ',
        BASIC_QUERY_COLUMNS = 'date_id, time_stamp, ',
        VALUES4 = ' VALUES ( ?, ?, ?, ? )',
        VALUES5 = ' VALUES ( ?, ?, ?, ?, ? )',
        VALUES6 = ' VALUES ( ?, ?, ?, ?, ?, ? )',
        PLACE_DATA_INSERT_QUERY = INSERT_QUERY + PLACE_TABLE_NAME + VALUES6,
        VISIT_DATA_INSERT_QUERY = INSERT_QUERY + VISIT_TABLE_NAME + VALUES4,
        PERSON_DATA_INSERT_QUETY = INSERT_QUERY + PERSON_TABLE_NAME + VALUES5,        
        database;
    
    function _initialize() {

        database = openDatabase(DB_NAME, DB_VERSION, DESCRIPTION, estimatedSize);
        database.transaction(function(txn){

            txn.executeSql(DROP_TABLE_QUERY + PLACE_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PLACE_TABLE_NAME + ' (' + BASIC_QUERY_COLUMNS + 'category, latitude, longitude, address )');

            txn.executeSql(DROP_TABLE_QUERY + VISIT_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + VISIT_TABLE_NAME + ' (' + BASIC_QUERY_COLUMNS + 'place_id, datetime )');

            txn.executeSql(DROP_TABLE_QUERY + PERSON_TABLE_NAME);
            txn.executeSql(CREATE_TABLE_QUERY + PERSON_TABLE_NAME + ' (' + BASIC_QUERY_COLUMNS + 'sex, age, interest )');

        });
    }

    function _insertPlaceData(place) {

        database.transaction(function(txn){

            txn.executeSql(PLACE_DATA_INSERT_QUERY,[place.id, place.timeStamp.getTime(), place.category, place.latLng.lat, place.latLng.lng, place.address]);
        });
    }

    function _insertVisitData(visit) {

        database.transaction(function(txn){

            txn.executeSql(VISIT_DATA_INSERT_QUERY, [visit.id, visit.timeStamp.getTime(), visit.placeId, visit.dateTime.getTime()]);
        });
    }

    function _insertPersonData(person) {

        database.transaction(function(txn){

            txn.executeSql(PERSON_DATA_INSERT_QUETY, [person.id, person.timeStamp.getTime(), person.sex, person.age, person.interest ]);
        });
    }

    _initialize();

    return {

        insertPlaceData : _insertPlaceData,
        insertVisitData : _insertVisitData,
        insertPersonData : _insertPersonData

    };
    
})();
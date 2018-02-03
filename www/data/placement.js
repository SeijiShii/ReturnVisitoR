'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement = function(publication){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'placement');
    this.publication = publication;
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement.fromDBData = function(dbData, callback) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        dbHelper = returnvisitor.common.dbHelper,
        Publcation = returnvisitor.data.Publcation,
        Placement = returnvisitor.data.Placement,
        _isPubReady = false,
        instance = new Placement();

    instance.id = dbData.data_id;
    instance.timeStamp.setTime(dbData.time_stamp);

    instance.visitId = dbData.visit_id;

    dbHelper.loadPublicationById(dbData.publication_id, function(pubData){

        instance.publication = Publcation.fromDBData(pubData);

        _isPubReady = true;
    });

    var wait = function(){

        if (_isPubReady) {
            clearInterval(timerId);

            if ( typeof callback === 'function' ) {
                callback(instance);
            }
        }
    };

    var timerId = setInterval(wait, 20);

};
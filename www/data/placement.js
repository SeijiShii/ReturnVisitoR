'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement = function(publication){

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.DataObject.call(this, 'placement');
    this.publication = publication;
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Placement.fromDBData = function(dbData, callback) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        dbHelper    = common.dbHelper,
        waiter      = common.waiter,
        Publication  = returnvisitor.data.Publication,
        Placement   = returnvisitor.data.Placement,
        _isPubReady = false,
        instance = new Placement();

    instance.id = dbData.data_id;
    instance.timeStamp.setTime(dbData.time_stamp);

    instance.visitId = dbData.visit_id;

    dbHelper.loadPublicationById(dbData.publication_id, function(pubData){

        instance.publication = Publication.fromDBData(pubData);

        _isPubReady = true;
    });

    waiter.wait(function(){

        if ( typeof callback === 'function' ) {
            callback(instance);
        }
        
    }, function(){
        return _isPubReady;
    });

};
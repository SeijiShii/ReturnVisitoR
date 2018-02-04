'use strict';

RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.nativeMapExtension = (function(){

    var _map, 
        _div,
        waiter = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.waiter;

    function _getRealBounds(callback) {

        var rect = _div.getBoundingClientRect(),
            farLeftLatLng, 
            nearRightLatLng;

        _map.fromPointToLatLng([rect.left, rect.top], function(latLng){
            farLeftLatLng = latLng;
        });

        _map.fromPointToLatLng([rect.left + rect.width, rect.top + rect.height], function(latLng){
            nearRightLatLng = latLng;
        });

        waiter.wait(function(){

            var farLeft = {
                    lat : farLeftLatLng.lat,
                    lng : farLeftLatLng.lng
                },
                farRight = {
                    lat : nearRightLatLng.lat,
                    lng : farLeftLatLng.lng
                },
                nearLeft = {
                    lat : farLeftLatLng.lat,
                    lng : nearRightLatLng.lng
                },
                nearRight = {
                    lat : nearRightLatLng.lat,
                    lng : nearRightLatLng.lng
                };

            callback({
                farLeft : farLeft,
                farRight : farRight,
                nearLeft : nearLeft,
                nearRight : nearRight 
            });

        }, function(){
            return farLeftLatLng && nearRightLatLng; 
        });
    }

    function _getRealCenter(callback) {

        _getRealBounds(function(b){

            callback({
                lat : (b.farLeft.lat + b.nearRight.lat) / 2,
                lng : (b.farLeft.lng + b.nearRight.lng) / 2
            });

        });
    }

    return {

        set map(map) {
            _map = map;
        },

        set div(div) {
            _div = div;
        },

        getRealBounds : _getRealBounds,
        getRealCenter : _getRealCenter,

    };
})();
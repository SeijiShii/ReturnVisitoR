"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.coordinates = (function(){

    var ONE_MINUTE = 2 * Math.PI / 60,
        ONE_HOUR = 2 * Math.PI / 12,
        TIME_ZERO = -(2 * Math.PI / 4);

    function _byRadian(radian, radius) {

        return {
            x : radius * Math.sin(radian),
            y : radius * Math.cos(radian)
        }
    }

    function _byHour(hour, radius) {
        return _byRadian(_hourToRadian(hour), radius);
    }

    function _byMinute(minute, radius) {
        return _byMinute(_minuteToRadian(minute), radius);
    }

    function _hourToRadian(hour) {
        return TIME_ZERO + ONE_HOUR * hour;
    }

    function _minuteToRadian(minute) {
        return TIME_ZERO + ONE_MINUTE * minute;
    }
    
    return {
        byRadian    : _byRadian,
        byHour      : _byHour,
        byMinute    : _byMinute

    }
})();

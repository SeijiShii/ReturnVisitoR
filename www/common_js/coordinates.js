'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.coordinates = (function(){

    var ONE_MINUTE = -2 * Math.PI / 60,
        ONE_HOUR = -2 * Math.PI / 12,
        TIME_ZERO = Math.PI / 2;

    function _radianToPostionFromCenter(radian, radius) {

        return {
            x : radius * Math.cos(radian),
            y : radius * Math.sin(radian)
        };
    }

    function _hourToPostionFromCenter(hour, radius) {
        return _radianToPostionFromCenter(_hourToRadian(hour), radius);
    }

    function _minuteToPositionFromCenter(minute, radius) {
        return _radianToPostionFromCenter(_minuteToRadian(minute), radius);
    }

    function _hourToRadian(hour) {
        return TIME_ZERO + ONE_HOUR * hour;
    }

    function _minuteToRadian(minute) {
        return TIME_ZERO + ONE_MINUTE * minute;
    }

    function _minToDegree(minute) {
        return _minuteToRadian(minute) / Math.PI * 180;
    }

    function _distance(pos1, pos2) {

        if (pos2 === undefined) {
            return Math.sqrt( Math.pow(pos1.x, 2) + Math.pow(pos1.y, 2));
        }

        var distX = pos2.x - pos1.x,
            distY = pos2.y - pos2.y;
        
        return Math.sqrt( Math.pow(distX, 2) + Math.pow(distY, 2));
    }

    function _positionToRadian(pos, origin) {
        
        var _origin = origin;
        if (_origin === undefined) {
            _origin = {
                x : 0,
                y : 0
            };
        }

        var distX = pos.x - _origin.x,
            distY = pos.y - _origin.y;

        return Math.atan2(distY, distX);
    }

    function _radianToMinute(radian) {
        
        var min = Math.round((TIME_ZERO + radian) / ONE_MINUTE);

        if (min < 0) {
            min += 60;
        }
        return min;
    }

    function _positionToMinute(pos, origin) {
        return _radianToMinute(_positionToRadian(pos, origin));
    }
    
    return {
        radianToPostion    : _radianToPostionFromCenter,
        hourToPostionFromCenter      : _hourToPostionFromCenter,
        minuteToPositionFromCenter    : _minuteToPositionFromCenter,
        minToDegree : _minToDegree,
        distance    : _distance,
        positionToMinute : _positionToMinute,
        // minuteToRadian : _minuteToRadian,
        hourToRadian : _hourToRadian

    };
})();

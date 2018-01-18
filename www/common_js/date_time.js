"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.dateTime = (function(){

    var localeCheck = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck,
        days = '日月火水木金土',
        SECOND  = 1000,
        MINUTE  = SECOND * 60,
        HOUR    = MINUTE * 60,
        DAY     = HOUR * 24;

    function shiftMonth(date, originalDay, plus) {

        if (plus) {

            // To first day of next month
            date.setDate(1);
            date.setDate(32);
            date.setDate(1);

            var lastDayOfNextMonth = _monthLastDay(date);

            if (originalDay < lastDayOfNextMonth) {
                date.setDate(originalDay);
            } else {
                date.setDate(lastDayOfNextMonth);
            }

        } else {

            date.setDate(0);
            var lastDayOfLastMonth = date.getDate();

            if (originalDay < lastDayOfLastMonth) {
                date.setDate(originalDay);
            } else {
                date.setDate(lastDayOfLastMonth);
            }
        }
    }

    function _addDate(date, n) {
        date.setTime(date.getTime() + n * DAY);
    }

    function _clonedDate(date) {

        var clonedDate = new Date();
        clonedDate.setTime(date.getTime());

        return clonedDate;
    }

    function _monthLastDay(date) {

        var clone = _clonedDate(date);
        clone.setDate(32);
        // console.log(clone.toDateString());
        clone.setDate(0);
        // console.log(clone.toDateString());

        return clone.getDate();
    }

    function _addMonth(date, n) {

        var day = date.getDate();

        for ( var i = 0 ; i < Math.abs(n) ; i++ ) {
            shiftMonth(date, day, n >= 0);
        }
    }

    return {
        dateString : function(date) {
            if (localeCheck.isJA()) {
                return [
                    date.getFullYear(),
                    date.getMonth() + 1,
                    date.getDate()
                ].join( '/' ) + ' (' + days[date.getDay()] + ')'
            } else {
                return date.toDateString();
            }
        },

        timeString : function(date) {
            return [
                date.getHours(),
                ( '00' + date.getMinutes()).slice(-2)
            ].join(':');
        },

        monthString : function(date) {
            if (localeCheck.isJA) {

                return [
                    date.getFullYear(),
                    '年 ',
                    date.getMonth() + 1,
                    '月'
                ].join('');

            } else {
                var array = date.toDateString().split(' ');
                return array[1] + ' ' + array[3];
            }
        },

        dayString : function(date) {
            if (localeCheck.isJA) {

                return days[date.getDay()];

            } else {

                return date.toDateString().split(' ')[0];
            }
        },

        addDate : _addDate,
        clonedDate : _clonedDate,
        addMonth : _addMonth,

        addedDate : function(date, n) {
            var clone = _clonedDate(date);
            _addDate(clone, n);
            return clone;
        },

        setSunday : function(date) {

            var day = date.getDay();

            if (day == 0) {
                return;
            }  else {
                date.setTime(date.getTime() - day * DAY);
            }
        },

        setMonday : function(date) {

            var day = date.getDay();
            if (day == 0) {
                date.setTime(date.getTime() - 6 * DAY);
            } else if (day == 1) {
                return;
            } else {
                date.setTime(date.getTime() - (day - 1) * DAY);
            }
        },


    }
})();
"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.dateTime = (function(){

    var localeCheck = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck,
        days = '日月火水木金土',
        SECOND  = 1000,
        MINUTE  = SECOND * 60,
        HOUR    = MINUTE * 60,
        DAY     = HOUR * 24;

    function shiftMonth(date, plus) {

        var day = date.getDate();

        date.setDate(0);

        if (plus) {
            _addDate(date, 32);
        }

        date.setDate(day);

    }

    function _addDate(date, n) {
        var addedDate = new Date();
        addedDate.setTime(date.getTime() + n * DAY);

        return addedDate;
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

        addedDate : _addDate,

        clonedDate : function(date) {

            var clonedDate = new Date();
            clonedDate.setTime(date.getTime());

            return clonedDate;
        },

        addDate : function(date, n) {
            date.setTime(date.getTime() + n * DAY);
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

        addMonth : function(date, n) {

            for ( var i = 0 ; i < Math.abs(n) ; i++ ) {
                shiftMonth(date, n > 1);
            }
        }

    }
})();
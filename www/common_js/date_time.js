"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.dateTime = (function(){

    var localeCheck = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck,
        days = '日月火水木金土';

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
        }
    }
})();
"use strict"

Date.prototype.addDate = function(n) {
    this.setDate(this.getDate() + n);
}

Date.prototype.addMonth = function(n) {
    this.setMonth(this.getMonth() + n);
}

Date.prototype.clone = function() {
    var cloned = new Date();
    cloned.setTime(this.getTime());
    return cloned;
}

Date.prototype.lastDay = function() {
    var cloned = this.clone();
    cloned.setDate(32);
    cloned.setDate(0);
    return cloned.getDate();
}

Date.prototype.dateString = (function(){
    var localeCheck = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck,
        days = '日月火水木金土';

    return function() {
        if (localeCheck.isJA()) {
            return [
                this.getFullYear(),
                this.getMonth() + 1,
                this.getDate()
            ].join( '/' ) + ' (' + days[this.getDay()] + ')'
        } else {
            return this.toDateString();
        }
    }

})();

Date.prototype.timeString = function() {
    return [
        this.getHours(),
        ( '00' + this.getMinutes()).slice(-2)
    ].join(':');
}

Date.prototype.monthString = function() {
    
    if (RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck.isJA) {

        return [
            this.getFullYear(),
            '年 ',
            this.getMonth() + 1,
            '月'
        ].join('');

    } else {
        var array = this.toDateString().split(' ');
        return array[1] + ' ' + array[3];
    }
}

Date.prototype.dayString = (function(){

    var localeCheck = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck,
        days = '日月火水木金土';

    return function() {
        if (localeCheck.isJA) {
    
            return days[this.getDay()];
    
        } else {
    
            return this.toDateString().split(' ')[0];
        }
    }
})()

Date.prototype.addedClone = function(n) {

    var cloned = this.clone();
    cloned.addDate(n);
    return cloned;
}

Date.prototype.setSunday = function() {
    this.addDate(-this.getDay());
}

Date.prototype.setMonday = function() {

    var day = this.getDay();
    if (day == 0) {
        this.addDate(-6);
    } else if (day == 1) {
        return;
    } else {
        this.addDate(-this.getDay() + 1 );
    }
}

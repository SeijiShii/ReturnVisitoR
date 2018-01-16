"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.localeCheck = {
    isJA : function() {
        if (cordova.platformId === 'android') {
            return window.navigator.language === 'ja-JP';
        } else {
            return window.navigator.languages[0] === 'ja';
        }
    }
}
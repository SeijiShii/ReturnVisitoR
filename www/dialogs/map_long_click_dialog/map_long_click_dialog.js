"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function(parent) {

    var _this = this, // コールバックがからまって訳わからなくなったのでthisをキャッシュすることにした。
        cancelButton,
        cancelButtonCallback;

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this, 
        parent, 
        ['../dialogs/map_long_click_dialog/map_long_click_dialog.html'], 
        {
            width: 200, 
            height: 225
        });

    function initCancelButton() {
        cancelButton = document.getElementById('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton);
    }

    function onClickCancelButton() {
        _this.fadeOut();
        if (typeof cancelButtonCallback === 'function') {
            cancelButtonCallback();
        }
    }

    // 171228 現時点でこのコールバックはセットされていないがフェードアウトすると仮マーカーも削除されるようにしてあるから良いかと
    this.setCancelButtonCallback = function(callback) {
        cancelButtonCallback = callback;
    }

    this.setLoadHtmlCallback(function() {
        initCancelButton();
    });
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog,
        writable: true
    }
})
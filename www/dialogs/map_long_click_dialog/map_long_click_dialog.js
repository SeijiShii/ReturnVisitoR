"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function() {

    var _this = this, // コールバックがからまって訳わからなくなったのでthisをキャッシュすることにした。
        newPlaceButton,
        newPlaceButtonCallback,
        cancelButton,
        cancelButtonCallback;

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this, 
        './dialogs/map_long_click_dialog/map_long_click_dialog.html');

    function initNewPlaceButton() {
        newPlaceButton = document.getElementById('new_place_button');
        newPlaceButton.addEventListener('click', onClickNewPlace, true);
    }

    function onClickNewPlace(e) {

        e.stopPropagation();
        // console.log('New place button clicked!');

        _this.fadeOutAndRemove(function(){
            if (typeof newPlaceButtonCallback === 'function') {
                newPlaceButtonCallback();
            }
        });
    }

    function initCancelButton() {
        cancelButton = document.getElementById('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton, true);
    }

    function onClickCancelButton(e) {

        e.stopPropagation();

        // console.log('Cancel button clicked!');

        _this.fadeOut(function() {
            if (typeof cancelButtonCallback === 'function') {
                cancelButtonCallback();
            }
        });
    }

    // 171228 現時点でこのコールバックはセットされていないがフェードアウトすると仮マーカーも削除されるようにしてあるから良いかと
    this.setCancelButtonCallback = function(callback) {
        cancelButtonCallback = callback;
    }

    this.setNewPlaceButtonCallback = function(callback) {
        newPlaceButtonCallback = callback;
    }

    this.setLoadHtmlCallback(function() {
        initNewPlaceButton();
        initCancelButton();
    });

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog,
        writable: true
    }
})
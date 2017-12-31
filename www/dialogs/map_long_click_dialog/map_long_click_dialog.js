"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function(parent, latLng) {

    var _this = this, // コールバックがからまって訳わからなくなったのでthisをキャッシュすることにした。
        _latLng = latLng,
        newPlaceButton,
        cancelButton,
        cancelButtonCallback;

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this, 
        parent, 
        ['../dialogs/map_long_click_dialog/map_long_click_dialog.html']);

    function initNewPlaceButton() {
        newPlaceButton = document.getElementById('new_place_button');
        newPlaceButton.addEventListener('click', onClickNewPlace);
    }

    function onClickNewPlace() {
        var lat = _latLng.lat;
        var lng = _latLng.lng;
        var path = "../record_visit_page/record_visit_page.html?method=RECORD_NEW_PLACE&" + getLatLngQueryString();
        console.log('path: ', path); 
        window.location.href = path;
    }

    function getLatLngQueryString() {
        var lat = _latLng.lat;
        var lng = _latLng.lng;
        return  "lat=" + lat + "&lng=" + lng;
    }

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
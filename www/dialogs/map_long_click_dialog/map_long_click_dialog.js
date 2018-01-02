"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function() {

    var _this = this, // コールバックがからまって訳わからなくなったのでthisをキャッシュすることにした。
        newPlaceButton,
        cancelButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile;

    returnvisitor.DialogBase.call(this, 
        './dialogs/map_long_click_dialog/map_long_click_dialog.html');

    loadFile.loadCss('./dialogs/map_long_click_dialog/map_long_click_dialog.css');

    function initNewPlaceButton() {
        newPlaceButton = _this.getElementById('new_place_button');
        newPlaceButton.addEventListener('click', onClickNewPlace, true);
    }

    function onClickNewPlace(e) {

        e.stopPropagation();
        // console.log('New place button clicked!');

        _this.fadeOut(function(){
            if (typeof _this.onNewPlaceClick === 'function') {
                _this.onNewPlaceClick();
            }
        });
    }

    function initCancelButton() {
        cancelButton = _this.getElementById('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton, true);
    }

    function onClickCancelButton(e) {

        e.stopPropagation();

        // console.log('Cancel button clicked!');

        _this.fadeOut(function() {
            if (typeof _this.onCancelClick === 'function') {
                _this.onCancelClick();
            }
        });
    }

    this.onDialogBaseReady = function() {
        initNewPlaceButton();
        initCancelButton();
    };

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype,{
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog,
        writable: true
    }
})
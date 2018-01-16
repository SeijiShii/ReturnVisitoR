"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function(parent) {

    var _this = this, // コールバックがからまって訳わからなくなったのでthisをキャッシュすることにした。
        newPlaceButton,
        cancelButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile;

    returnvisitor.DialogBase.call(this, 
        './dialogs/map_long_click_dialog/map_long_click_dialog.html', 'map_long_click_dialog', parent);

    loadFile.loadCss('./dialogs/map_long_click_dialog/map_long_click_dialog.css');

    function initNewPlaceButton() {
        newPlaceButton = _this.getElementByClassName('new_place_button');
        newPlaceButton.addEventListener('click', onClickNewPlace, true);
    }

    function onClickNewPlace(e) {

        e.stopPropagation();
        // console.log('New place button clicked!');

        _this.fadeOut(_this.onNewPlaceClick);
    }

    function initCancelButton() {
        cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton, true);
    }

    function onClickCancelButton(e) {

        e.stopPropagation();

        _this.fadeOut(_this.onCancelClick);

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
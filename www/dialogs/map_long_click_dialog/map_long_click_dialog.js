"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.MapLongClickDialog = function(parent, pathToJSFileFolder) {

    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this, 
        parent, 
        ['../dialogs/map_long_click_dialog/map_long_click_dialog.html'], 
        {
            width: 200, 
            height: 225
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
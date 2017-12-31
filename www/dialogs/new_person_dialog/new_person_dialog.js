"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog = function(parent) {
    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this,
        parent, 
        ['../dialogs/new_person_dialog/new_person_dialog.html']);
    
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog,
        writable: true
    }
});
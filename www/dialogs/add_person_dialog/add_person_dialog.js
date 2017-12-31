"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function(parent) {
    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this,
        parent, 
        ['../dialogs/add_person_dialog/add_person_dialog.html']);
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog,
        writable: true
    }
});
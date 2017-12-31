"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function(parent) {
    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this,
        parent, 
        ['../dialogs/add_person_dialog/add_person_dialog.html']);
    
    var _parent = parent,
        newPersonButton,
        newPersonDialog;

    function initNewPersonButton() {
        newPersonButton = document.getElementById('new_person_button');
        newPersonButton.addEventListener('click', onClickNewPersonButton);
    }

    function onClickNewPersonButton() {
        newPersonDialog = new RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog(_parent);
        newPersonDialog.fadeIn();
    }

    this.setLoadHtmlCallback(function(){
        initNewPersonButton();
    });
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog,
        writable: true
    }
});
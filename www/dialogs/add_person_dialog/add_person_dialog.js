"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function() {

    var _this = this,
        newPersonButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/add_person_dialog/add_person_dialog.html']);
    
    loadFile.loadCss('./dialogs/add_person_dialog/add_person_dialog.css');


    function initNewPersonButton() {
        
        newPersonButton = _this.getElementByClassName('new_person_button');
        newPersonButton.addEventListener('click', onClickNewPersonButton);
    }

    function onClickNewPersonButton() {
        _this.fadeOut()
        if (typeof _this.onNewPersonClick === 'function') {
            _this.onNewPersonClick();
        }
    }

    this.onDialogBaseReady = function(){
        initNewPersonButton();
    };
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog,
        writable: true
    }
});
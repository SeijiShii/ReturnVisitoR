"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function(everSeenPersons) {

    var _this = this,
        newPersonButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        PersonCell = returnvisitor.viewComponents.PersonCell;

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

    function initEverSeenText() {
        var everSeenText = _this.getElementByClassName('ever_seen_text');
        if (everSeenPersons.length <= 0) {
            $(everSeenText).css({
                display : 'none'
            })
        } else {
            $(everSeenText).css({
                display : 'block'
            })
        }
    }

    function initEverSeenContainer() {
        var everSeenContainer = _this.getElementByClassName('ever_seen_container');

        for ( var i = 0 ; i < everSeenPersons.length ; i++ ) {
            var personCell = new PersonCell(everSeenContainer, everSeenPersons[i]);
        }

    }

    this.onDialogBaseReady = function(){
        initNewPersonButton();
        initEverSeenText();
        initEverSeenContainer();
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
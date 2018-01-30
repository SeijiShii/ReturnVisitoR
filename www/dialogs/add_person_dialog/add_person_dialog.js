'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function(everSeenPersonIds, blockedPersonIds) {

    var _this = this,
        newPersonButton,
        everSeenText,
        everSeenContainer,
        _everSeenPersons = [],
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        PersonCell = returnvisitor.viewComponents.PersonCell;

    loadFile.loadCss('./dialogs/add_person_dialog/add_person_dialog.css');
    returnvisitor.DialogBase.call(this,
        ['./dialogs/add_person_dialog/add_person_dialog.html'], 'add_person_dialog');
    

    function loadEverSeenPersons() {
        
        
    }

    function initNewPersonButton() {
        
        newPersonButton = _this.getElementByClassName('new_person_button');
        newPersonButton.addEventListener('click', onClickNewPersonButton);
    }

    function onClickNewPersonButton() {
        _this.fadeOut();
        if (typeof _this.onNewPersonClick === 'function') {
            _this.onNewPersonClick();
        }
    }

    function initEverSeenText() {
        everSeenText = _this.getElementByClassName('ever_seen_text');
        refreshEverSeenText();
    }

    function refreshEverSeenText() {
        if (_everSeenPersons.length <= 0) {
            $(everSeenText).css({
                display : 'none'
            });
        } else {
            $(everSeenText).css({
                display : 'block'
            });
        }
    }

    function initEverSeenContainer() {
        everSeenContainer = _this.getElementByClassName('ever_seen_container');
        refreshEverSeenContainer();
    }

    function refreshEverSeenContainer() {

        if (_everSeenPersons.length <= 0) {

            $(everSeenContainer).css({
                display : 'none'
            });

        } else {
            
            $(everSeenContainer).css({
                display : 'block'
            });

            for ( var i = 0 ; i < _everSeenPersons.length ; i++ ) {

                var personCell = new PersonCell(everSeenContainer, _everSeenPersons[i], blockedPersonIds.includes(_everSeenPersons[i].id));

                personCell.onReadyCell = function() {
                    _this.refreshDialogHeight();
                };

                personCell.onClickCell = function(person) {
                    _this.fadeOut(function(){
                        if ( typeof _this.onClickPersonCell === 'function' ) {
                            _this.onClickPersonCell(person);
                        }
                    });
                };
            }
        }
    }

    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    this.onDialogBaseReady = function(){
        loadEverSeenPersons();
        initNewPersonButton();
        initEverSeenText();
        initEverSeenContainer();
        initCancelButton();
    };
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog,
        writable: true
    }
});
'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog = function(personsInPlace, blockedPersonIds) {

    var _this = this,
        newPersonButton,
        everSeenText,
        personContainer,
        _personsInPlace = personsInPlace,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elementsEffect = common.elementsEffect,
        PersonCell = returnvisitor.viewComponents.PersonCell;

    function initialize() {
        loadFile.loadCss('./dialogs/add_person_dialog/add_person_dialog.css');
        returnvisitor.DialogBase.call(_this, './dialogs/add_person_dialog/add_person_dialog.html', _dialogBaseReadyCallback);    
    }
    
    function _dialogBaseReadyCallback(){
        initPersonContainer();
        initNewPersonButton();
        initCancelButton();
    }

    function initNewPersonButton() {
        
        newPersonButton = _this.getElementByClassName('new_person_button');
        elementsEffect.blinker(newPersonButton);
        newPersonButton.addEventListener('click', onClickNewPersonButton);
    }

    function onClickNewPersonButton() {
        _this.fadeOut();
        if (typeof _this.onNewPersonClick === 'function') {
            _this.onNewPersonClick();
        }
    }

    function initPersonContainer() {
        personContainer = _this.getElementByClassName('person_container');
        refreshPersonContainer();
    }

    function refreshPersonContainer() {

        if (_personsInPlace.length <= 0) {

            $(personContainer).css({
                display : 'none',
            });

        } else {
            
            $(personContainer).css({
                display : 'block',
                height : _personsInPlace.length * 40
            });

            for ( var i = 0 ; i < _personsInPlace.length ; i++ ) {

                var personCell = new PersonCell(personContainer, _personsInPlace[i], blockedPersonIds.includes(_personsInPlace[i].id));

                // personCell.onReadyCell = function() {
                //     _this.refreshDialogHeight();
                // };

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
    initialize();
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.AddPersonDialog,
        writable: true
    }
});
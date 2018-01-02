"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog = function() {

    var _this = this,
        _person,
        maleButton,
        maleToggleBase,
        maleToggleButton,
        femaleButton,
        femaleToggleBase,
        femaleToggleButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        buttonMarkerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths.buttonMarkerPaths,
        viewComponents = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/new_person_dialog/new_person_dialog.html']);

    loadFile.loadCss('./dialogs/new_person_dialog/new_person_dialog.css');
    
    _person = new returnvisitor.data.Person();
    
    function initMaleButton() {
        maleButton = _this.getElementById('male_button');
        maleToggleBase = _this.getElementById('male_toggle_button');
        maleToggleButton = new viewComponents.ToggleButton(maleToggleBase);
        maleButton.addEventListener('click', onClickMaleButton);
    }

    function onClickMaleButton() {

        console.log('onClickMaleButton! _person.sex:', _person.sex);

        if (_person.sex != 1) {
            _person.sex = 1;
            maleToggleButton.toggled = true;
            femaleToggleButton.toggled = false;

        }
    }

    function initFemaleButton() {
        femaleButton = _this.getElementById('female_button');
        femaleToggleBase = _this.getElementById('female_toggle_button');
        femaleToggleButton = new viewComponents.ToggleButton(femaleToggleBase);
        femaleButton.addEventListener('click', onClickFemaleButton);
    }

    function onClickFemaleButton() {

        console.log('onClickFemaleButton! _person.sex:', _person.sex);

        if (_person.sex != 2) {
            _person.sex = 2;
            maleToggleButton.toggled = false;
            femaleToggleButton.toggled = true;
        }
    }

    this.onDialogBaseReady = function(){
        initMaleButton();
        initFemaleButton();
    };
    

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog,
        writable: true
    }
});
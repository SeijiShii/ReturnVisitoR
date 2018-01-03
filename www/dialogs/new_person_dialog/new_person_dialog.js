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
        ageSelector,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        Person = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        buttonMarkerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths.buttonMarkerPaths,
        viewComponents = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/new_person_dialog/new_person_dialog.html']);

    loadFile.loadCss('./dialogs/new_person_dialog/new_person_dialog.css');
    
    _person = new Person();
    
    function initMaleButton() {
        maleButton = _this.getElementById('male_button');
        maleToggleBase = _this.getElementById('male_toggle_button');
        maleToggleButton = new viewComponents.ToggleButton(maleToggleBase);
        maleButton.addEventListener('click', onClickMaleButton);
    }

    function onClickMaleButton() {

        if (_person.sex !== Person.sex.MALE) {
            _person.sex = Person.sex.MALE;
            maleToggleButton.toggled = true;
            femaleToggleButton.toggled = false;

            console.log('_person.sex:', _person.sex)
        }
    }

    function initFemaleButton() {
        femaleButton = _this.getElementById('female_button');
        femaleToggleBase = _this.getElementById('female_toggle_button');
        femaleToggleButton = new viewComponents.ToggleButton(femaleToggleBase);
        femaleButton.addEventListener('click', onClickFemaleButton);
    }

    function onClickFemaleButton() {

        if (_person.sex !== Person.sex.FEMALE) {
            _person.sex = Person.sex.FEMALE;
            maleToggleButton.toggled = false;
            femaleToggleButton.toggled = true;

            console.log('_person.sex:', _person.sex)

        }
    }

    function initAgeSelector() {
        var ageSelectorBase = _this.getElementById('age_selector_base');

        ageSelector = new viewComponents.MenuSelector(ageSelectorBase, Person.age);
    }

    this.onDialogBaseReady = function(){
        initMaleButton();
        initFemaleButton();
        initAgeSelector();
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
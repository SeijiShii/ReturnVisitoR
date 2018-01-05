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
        interestRater,
        interestText,
        INTEREST_PREFIX = 'Interest: ',
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

        if (_person.sex === 'MALE') {
            maleButton.toggled = true;
            femaleToggleButton.toggled = false;
        } else {
            maleToggleButton.toggled = false
        }
    }

    function onClickMaleButton() {

        if (_person.sex !== 'MALE') {
            _person.sex = 'MALE';
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

        if (_person.sex === 'FWMALE') {
            maleToggleButton.toggled = false;
            femaleToggleButton.toggled = true;
        } else {
            femaleToggleButton.toggled = false
        }
    }

    function onClickFemaleButton() {

        if (_person.sex !== 'FEMALE') {
            _person.sex = 'FEMALE';
            maleToggleButton.toggled = false;
            femaleToggleButton.toggled = true;

            console.log('_person.sex:', _person.sex)

        }
    }

    function initAgeSelector() {
        var ageSelectorBase = _this.getElementById('age_selector_base');

        ageSelector = new viewComponents.MenuSelector(ageSelectorBase, Person.age, _person.age);
        ageSelector.onSelectOption = function(selecteKey) {

            _person.age = selecteKey;
            // console.log('_person.age:', _person.age);

        }
    }

    function initInterestRater() {

        var raterBase = _this.getElementById('interest_rater_base');

        interestRater = new viewComponents.Rater(raterBase, Person.interest, buttonMarkerPaths);
        interestRater.onSetRater = function(key) {
            _person.interest = key;
            refreshInterestText();
            // console.log('_person.interest: ', _person.interest);
        }

    }

    function initInterestText() {
        interestText = _this.getElementById('interest_text');
        refreshInterestText();
    }

    function refreshInterestText() {

        var text;
        if (_person.interest === undefined) {
            text = INTEREST_PREFIX + Person.interest['INTEREST_NONE'];
        } else{
            text = INTEREST_PREFIX + Person.interest[_person.interest];
        }

        interestText.innerText = text;
    }

    this.onDialogBaseReady = function(){
        initMaleButton();
        initFemaleButton();
        initAgeSelector();
        initInterestRater();
        initInterestText();
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
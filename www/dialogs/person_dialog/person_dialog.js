"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PersonDialog = function() {

    var _this = this,
        _person,
        maleButton,
        femaleButton,
        ageSelector,
        interestRater,
        interestText,
        INTEREST_PREFIX = 'Interest: ',
        okButton,
        deleteButton,
        deleteButtonRow,
        cancelButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        Person = returnvisitor.data.Person,
        loadFile = returnvisitor.common.loadFile,
        buttonMarkerPaths =returnvisitor.common.markerPaths.buttonMarkerPaths,
        viewComponents = returnvisitor.viewComponents,
        ToggleButton = viewComponents.ToggleButton;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/person_dialog/person_dialog.html']);

    loadFile.loadCss('./dialogs/person_dialog/person_dialog.css');
    
    _person = new Person();
    
    function initMaleButton() {
        var maleButtonBase = _this.getElementById('male_button_base');
        maleButton = new ToggleButton(maleButtonBase, 'Male', _person.sex === 'MALE');
        maleButton.uncheckable = false;
        maleButton.onChange = function(toggled) {
            if (toggled) {
                _person.sex = 'MALE';
                femaleButton.toggle(false, true);
            }
        }
    }

    function initFemaleButton() {
        var femaleButtonBase = _this.getElementById('female_button_base');
        femaleButton = new ToggleButton(femaleButtonBase, 'Female', _person.sex === 'FEMALE');
        femaleButton.uncheckable = false;
        femaleButton.onChange = function(toggled) {
            if (toggled) {
                _person.sex = 'FEMALE';
                maleButton.toggle(false, true);
            }
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

    function initOkButton() {
        okButton = _this.getElementById('ok_button');
        okButton.addEventListener('click', onClickOkButton);
    }

    function onClickOkButton() {

        _this.fadeOut();

        if(typeof _this.onClickOk === 'function') {
            _this.onClickOk(_person);
        }
    }

    function initDeleteButtonRow() {
        deleteButtonRow = _this.getElementById('delete_button_row');
    }

    function initDeleteButton() {
        deleteButton = _this.getElementById('delete_button');
        deleteButton.addEventListener('click', onClickDeleteButton);

    }

    function onClickDeleteButton() {

        alert('Hoge!')
        
    }

    function initCancelButton() {
        cancelButton = _this.getElementById('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton);
    }

    function onClickCancelButton() {

        _this.fadeOut();

    }

    this.onDialogBaseReady = function(){
        initMaleButton();
        initFemaleButton();
        initAgeSelector();
        initInterestRater();
        initInterestText();

        initOkButton();
        initDeleteButtonRow();
        initDeleteButton();
        initCancelButton();
    };
    

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PersonDialog,
        writable: true
    }
});
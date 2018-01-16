"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PersonDialog = function() {

    var _this = this,
        _person,
        nameText,
        maleButton,
        femaleButton,
        ageSelector,
        interestRater,
        interestText,
        INTEREST_PREFIX = 'Interest: ',
        noteText,
        okButton,
        deleteButton,
        deleteButtonRow,
        cancelButton,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        Person = returnvisitor.data.Person,
        loadFile = returnvisitor.common.loadFile,
        raterColors = returnvisitor.common.raterColors,
        buttonMarkerPaths =returnvisitor.common.markerPaths.buttonMarkerPaths,
        viewComponents = returnvisitor.viewComponents,
        ToggleButton = viewComponents.ToggleButton;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/person_dialog/person_dialog.html'], 'person_dialog');

    loadFile.loadCss('./dialogs/person_dialog/person_dialog.css');
    
    _person = new Person();
    
    function initNameText() {
        nameText = _this.getElementByClassName('person_name_text');
    }

    function initMaleButton() {
        var maleButtonBase = _this.getElementByClassName('male_button_base');
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
        var femaleButtonBase = _this.getElementByClassName('female_button_base');
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
        var ageSelectorBase = _this.getElementByClassName('age_selector_base');

        ageSelector = new viewComponents.MenuSelector(ageSelectorBase, Person.age, _person.age);
        ageSelector.onSelectOption = function(selecteKey) {

            _person.age = selecteKey;
            // console.log('_person.age:', _person.age);

        }
    }

    function initInterestRater() {

        var raterBase = _this.getElementByClassName('interest_rater_base');

        var interestValue = Person.interest.indexOfKey(_person.interest);
        interestRater = new viewComponents.Rater(raterBase, raterColors.interestColors, interestValue);
        interestRater.onSetRater = function(val) {
            var keys = Object.keys(Person.interest);
            _person.interest = keys[val];
            refreshInterestText();
            // console.log('_person.interest: ', _person.interest);
        }
    }

    function initInterestText() {
        interestText = _this.getElementByClassName('interest_text');
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

    function initNoteText() {
        noteText = _this.getElementByClassName('person_note_text');
    }

    function initOkButton() {
        okButton = _this.getElementByClassName('ok_button');
        okButton.addEventListener('click', onClickOkButton);
    }

    function onClickOkButton() {

        _person.name = nameText.value;
        _person.note = noteText.value;

        _this.fadeOut(_this.onClickOk, _person);
    }

    function initDeleteButtonRow() {
        deleteButtonRow = _this.getElementByClassName('delete_button_row');
    }

    function initDeleteButton() {
        deleteButton = _this.getElementByClassName('delete_button');
        deleteButton.addEventListener('click', onClickDeleteButton);

    }

    function onClickDeleteButton() {

        alert('Hoge!')
        
    }

    function initCancelButton() {
        cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton);
    }

    function onClickCancelButton() {

        _this.fadeOut();

    }

    this.onDialogBaseReady = function(){
        initNameText();
        initMaleButton();
        initFemaleButton();
        initAgeSelector();
        initInterestRater();
        initInterestText();
        initNoteText();

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
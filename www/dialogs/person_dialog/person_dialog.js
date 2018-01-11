"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.PersonDialog = function() {

    var _this = this,
        _person,
        maleButtonBase,
        // maleToggleBase,
        // maleToggleButton,
        femaleButtonBase,
        // femaleToggleBase,
        // femaleToggleButton,
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
        maleButtonBase = _this.getElementById('male_button_base');
        var maleButton = new ToggleButton(maleButtonBase, 'Male');
        // maleToggleBase = _this.getElementById('male_toggle_button');
        // maleToggleButton = new viewComponents.ToggleButton(maleToggleBase);
        // maleButton.addEventListener('click', onClickMaleButton);

        // if (_person.sex === 'MALE') {
        //     maleButton.toggled = true;
        //     femaleToggleButton.toggled = false;
        // } else {
        //     maleToggleButton.toggled = false
        // }
    }

    // function onClickMaleButton() {

    //     if (_person.sex !== 'MALE') {
    //         _person.sex = 'MALE';
    //         maleToggleButton.toggled = true;
    //         femaleToggleButton.toggled = false;

    //         console.log('_person.sex:', _person.sex)
    //     }
    // }

    function initFemaleButton() {
        femaleButtonBase = _this.getElementById('female_button_base');
        // femaleToggleBase = _this.getElementById('female_toggle_button');
        var femaleButton = new ToggleButton(femaleButtonBase, 'Female');
        // femaleButton.addEventListener('click', onClickFemaleButton);

        // if (_person.sex === 'FWMALE') {
        //     maleToggleButton.toggled = false;
        //     femaleToggleButton.toggled = true;
        // } else {
        //     femaleToggleButton.toggled = false
        // }
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
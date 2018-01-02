"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog = function() {

    var _this = this,
        _person,
        maleButton,
        maleButtonImage,
        femaleButton,
        femaleButtonImage,
        // buttonOnImagePath = './img/button_marker/button_marker_emerald.png',
        // buttonOffImagePath = './img/button_marker/button_marker_gray.png',
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        buttonMarkerPaths = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.markerPaths.buttonMarkerPaths;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/new_person_dialog/new_person_dialog.html']);

    loadFile.loadCss('./dialogs/new_person_dialog/new_person_dialog.css');
    
    _person = new returnvisitor.data.Person();
    
    function initMaleButton() {
        maleButton = _this.getElementById('male_button');
        maleButtonImage = _this.getElementById('male_button_image');
        maleButton.addEventListener('click', onClickMaleButton);
    }

    function onClickMaleButton() {
        _person.sex = 1;
        fadeAndChangeButtonImage(maleButtonImage, buttonMarkerPaths.emeraldButton);
        fadeAndChangeButtonImage(femaleButtonImage, buttonMarkerPaths.grayButton);        
    }

    function initFemaleButton() {
        femaleButton = _this.getElementById('female_button');
        femaleButtonImage = _this.getElementById('female_button_image');
        femaleButton.addEventListener('click', onClickFemaleButton);
    }

    function onClickFemaleButton() {
        _person.sex = 2;
        fadeAndChangeButtonImage(maleButtonImage, buttonMarkerPaths.grayButton);
        fadeAndChangeButtonImage(femaleButtonImage, buttonMarkerPaths.emeraldButton);
    }

    function fadeAndChangeButtonImage(element, toPath) {
        $(element).fadeOut(300, function() {
            element.src = toPath;
            $(element).fadeIn(300);
        })
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
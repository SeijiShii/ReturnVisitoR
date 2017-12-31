"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog = function(parent) {
    RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.call(this,
        parent, 
        ['../dialogs/new_person_dialog/new_person_dialog.html']);

    var _person,
        maleButton,
        maleButtonImage,
        femaleButton,
        femaleButtonImage,
        buttonOnImagePath = '../img/button_marker/button_marker_emerald.png',
        buttonOffImagePath = '../img/button_marker/button_marker_gray.png';
    
    _person = new RETURNVISITOR_APP.work.c_kogyo.returnvisitor.data.Person();
    
    function initMaleButton() {
        maleButton = document.getElementById('male_button');
        maleButtonImage = document.getElementById('male_button_image');
        maleButton.addEventListener('click', onClickMaleButton);
    }

    function onClickMaleButton() {
        _person.sex = 1;
        maleButtonImage.src = buttonOnImagePath;
        femaleButtonImage.src = buttonOffImagePath;
        
    }

    function initFemaleButton() {
        femaleButton = document.getElementById('female_button');
        femaleButtonImage = document.getElementById('female_button_image');
        femaleButton.addEventListener('click', onClickFemaleButton);
    }

    function onClickFemaleButton() {
        _person.sex = 2;
        maleButtonImage.src = buttonOffImagePath;
        femaleButtonImage.src = buttonOnImagePath;
    }

    this.setLoadHtmlCallback(function(){
        initMaleButton();
        initFemaleButton();
    })
    

}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.NewPersonDialog,
        writable: true
    }
});
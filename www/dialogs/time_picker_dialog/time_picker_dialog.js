"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog = function(time) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        viewComponents = returnvisitor.viewComponents,
        TimePickerPane = viewComponents.TimePickerPane,
        timePickerPane;


    returnvisitor.DialogBase.call(this,
        ['./dialogs/time_picker_dialog/time_picker_dialog.html'], 'time_picker_dialog');
    
    loadFile.loadCss('./dialogs/time_picker_dialog/time_picker_dialog.css');

    function initTimePickerPane() {

        var timePickerDiv = _this.getElementByClassName('time_picker_div');
        timePickerPane = new TimePickerPane(timePickerDiv, time);
    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    this.onDialogBaseReady = function(){

        initTimePickerPane();
        initCancelButton();
    };

    this.onDialogResize = function() {


    }
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog,
        writable: true
    }
});
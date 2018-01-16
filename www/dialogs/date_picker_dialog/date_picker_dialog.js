"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog = function() {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        SwipePane = returnvisitor.viewComponents.SwipePane;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/date_picker_dialog/date_picker_dialog.html'], 'date_picker_dialog');
    
    loadFile.loadCss('./dialogs/date_picker_dialog/date_picker_dialog.css');

    function initCalendarFrame() {
        var calendarFrame = _this.getElementByClassName('calendar_frame');
        
        var swipePane = new SwipePane(calendarFrame);
    }

    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    this.onDialogBaseReady = function(){
        initCalendarFrame();
        initCancelButton();

    };
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog,
        writable: true
    }
});
"use strict"
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog = function() {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        CalendarPane = returnvisitor.viewComponents.CalendarPane,
        calendarDiv,
        calendarPane;

    returnvisitor.DialogBase.call(this,
        ['./dialogs/date_picker_dialog/date_picker_dialog.html'], 'date_picker_dialog');
    
    loadFile.loadCss('./dialogs/date_picker_dialog/date_picker_dialog.css');

    function initCalendarDiv() {
        calendarDiv = _this.getElementByClassName('calendar_div');
        refreshCalendarDivHeight();
        calendarPane = new CalendarPane(calendarDiv);        
    }

    function refreshCalendarDivHeight() {
        $(calendarDiv).css({
            height : (calendarDiv.parentNode.clientHeight - 55 ) + 'px'
        })
    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    this.onDialogBaseReady = function(){
        initCalendarDiv();
        initCancelButton();
    };

    this.onDialogResize = function() {

        refreshCalendarDivHeight();

        if (calendarPane) {
            calendarPane.resizePane();
        }
    }
}

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DatePickerDialog,
        writable: true
    }
});
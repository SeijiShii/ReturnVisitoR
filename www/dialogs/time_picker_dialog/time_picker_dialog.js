'use strict';
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog = function(time) {

    var _this = this,
        _time = time.clone(),
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = returnvisitor.common.loadFile,
        viewComponents = returnvisitor.viewComponents,
        timePickerPane = viewComponents.timePickerPane;

    function initialize() {
        loadFile.loadCss('./dialogs/time_picker_dialog/time_picker_dialog.css');
        returnvisitor.DialogBase.call(_this, './dialogs/time_picker_dialog/time_picker_dialog.html', _onDialogBaseReadyCallback);
    }

    function _onDialogBaseReadyCallback(){

        initTimePickerPane();
        initOkButton();
        initCancelButton();
    }
    
    
    function initTimePickerPane() {

        var timePickerDiv = _this.getElementByClassName('time_picker_div');
        timePickerPane.initialize(timePickerDiv, time);
    }

    function initOkButton() {
        
        var okButton = _this.getElementByClassName('ok_button');
        okButton.addEventListener('click', onOkClick);
    }

    function onOkClick() {

        _time = timePickerPane.time;

        if ( typeof _this.onSetTime === 'function' ) {
            _this.onSetTime(_time);
        }
        _this.fadeOut();

    }
    
    function initCancelButton() {
        var cancelButton = _this.getElementByClassName('cancel_button');
        cancelButton.addEventListener('click', onCancelClick);
    }

    function onCancelClick() {
        _this.fadeOut();
    }

    this.onDialogResize = function() {


    };

    initialize();
};

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog.prototype = Object.create(RETURNVISITOR_APP.work.c_kogyo.returnvisitor.DialogBase.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: RETURNVISITOR_APP.work.c_kogyo.returnvisitor.TimePickerDialog,
        writable: true
    }
});
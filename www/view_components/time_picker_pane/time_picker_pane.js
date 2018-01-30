'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.timePickerPane = (function() {

    var _time,
        paneFrame,
        clockFrame,
        hourPickerPane,
        minutePickerPane,
        hourText,
        minuteText,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        viewComponents = returnvisitor.viewComponents,
        _isHourPickerShowing = true;
        
    
    function _initialize(parent, time) {

        _time = time.clone();

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            clockFrame = elements.getElementByClassName(paneFrame, 'clock_frame');

            initHourPickerPane();
            initMinutePickerPane();
            initHourText();
            initMinuteText();

            parent.appendChild(paneFrame);

        });

    }

    function initHourPickerPane() {

        loadFile.loadScript('./view_components/hour_picker_pane/hour_picker_pane.js', function(){

            hourPickerPane = viewComponents.hourPickerPane;
            hourPickerPane.initialize(clockFrame, _time.getHours(), 200);
            hourPickerPane.onClickHourButton = function(hour) {
                _time.setHours(hour);
                refreshHourText();
            };
        });
    }

    function initMinutePickerPane() {

        loadFile.loadScript('./view_components/minute_picker_pane/minute_picker_pane.js', function(){
            
            minutePickerPane = viewComponents.minutePickerPane;
            minutePickerPane.initialize(clockFrame, 100);
            minutePickerPane.onMinuteSet = function(minute) {
                _time.setMinutes(minute);
                refreshMinuteText();
            };
        });
    }
  
    function initHourText() {
        hourText = elements.getElementByClassName(paneFrame, 'hour_text');
        elementsEffect.blinker(hourText);
        refreshHourText();
        hourText.addEventListener('click', onClickHourText);
    }
    
    function refreshHourText() {
        hourText.innerText = _time.getHours();
        if (_isHourPickerShowing) {
            hourText.style.color = 'springgreen';
        } else {
            hourText.style.color = 'gray';
        }
    }

    function onClickHourText() {
        
        if (!_isHourPickerShowing) {

            _isHourPickerShowing = true;

            hourPickerPane.popPane(200);
            minutePickerPane.convergePane(100);
            refreshHourText();
            refreshMinuteText();
        }

    }

    function initMinuteText() {
        minuteText = elements.getElementByClassName(paneFrame, 'minute_text');
        elementsEffect.blinker(minuteText);
        refreshMinuteText();
        minuteText.addEventListener('click', onClickMinuteText);
    }

    function refreshMinuteText() {
        minuteText.innerText = _time.getPaddedMinutes();
        if (_isHourPickerShowing) {
            minuteText.style.color = 'gray';
        } else {
            minuteText.style.color = 'springgreen';
        }
    }

    function onClickMinuteText() {
        
        if (_isHourPickerShowing) {
            
            _isHourPickerShowing = false;

            minutePickerPane.popPane(200);
            hourPickerPane.convergePane(100);
            refreshHourText();
            refreshMinuteText();
        }
    }
    
    return {

        initialize : _initialize,
        set time(time) {
            _time = time;
            refreshHourText();
            refreshMinuteText();
        },
        get time() {
            return _time;
        }
    };
    
})();


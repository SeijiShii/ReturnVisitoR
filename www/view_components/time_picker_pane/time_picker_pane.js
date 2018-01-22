'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {


    this._time = time;
    var _this = this,
        paneFrame,
        clockFrame,
        hourPickerPane,
        minutePickerPane,
        // minuteFrame,
        // minuteChildFrame,
        // minuteHandCanvas,
        hourText,
        minuteText,
        // minuteMarks = [],
        // subMinMarks = {},
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        // coordinates = common.coordinates,
        // touchEventFilter = common.touchEventFilter,
        viewComponents = returnvisitor.viewComponents,
        // CLOCK_PANE_SIZE = 200,
        // MINUTE_CLOCK_RADIUS = 80,
        // POP_DURATION = 300,
        _isHourPickerShowing = true;
        
    
    function initialize() {

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

    // eslint-disable-next-line no-unused-vars
    function waitCallbackReady() {

        var startTime = new Date().getTime();

        var waitTimer = function() {

            var counter = new Date().getTime() - startTime;

            if (counter > 500) {
                clearInterval(waitTimerId);
                throw new Error('Time picker pane frame takes more than 500ms.');
            }

            if ( typeof _this.onPaneFrameReady === 'function' ) {
                clearInterval(waitTimerId);
                _this.onPaneFrameReady();
            }
            // console.log('Waiting time picker pane callback ready for ' + counter + 'ms.');
        };
        var waitTimerId = setInterval(waitTimer, 50);
    }

    function initHourPickerPane() {

        loadFile.loadScript('./view_components/hour_picker_pane/hour_picker_pane.js', function(){

            hourPickerPane = viewComponents.hourPickerPane;
            hourPickerPane.initialize(clockFrame, _this._time.getHours(), 200);
            hourPickerPane.onClickHourButton = function(hour) {
                _this._time.setHours(hour);
                refreshHourText();
            };
        });
    }

    function initMinutePickerPane() {

        loadFile.loadScript('./view_components/minute_picker_pane/minute_picker_pane.js', function(){
            
            minutePickerPane = viewComponents.minutePickerPane;
            minutePickerPane.initialize(clockFrame, 100);
            minutePickerPane.onMinuteSet = function(minute) {
                _this._time.setMinutes(minute);
                refreshMinuteText();
            };
        });
    }
  
    function initHourText() {
        hourText = elements.getElementByClassName(paneFrame, 'hour_text');
        refreshHourText();
        hourText.addEventListener('click', onClickHourText);
    }
    
    function refreshHourText() {
        hourText.innerText = _this._time.getHours();
        if (_isHourPickerShowing) {
            hourText.style.color = 'springgreen';
        } else {
            hourText.style.color = 'gray';
        }
    }

    function onClickHourText() {
        elementsEffect.blink(hourText);

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
        refreshMinuteText();
        minuteText.addEventListener('click', onClickMinuteText);
    }

    function refreshMinuteText() {
        minuteText.innerText = _this._time.getPaddedMinutes();
        if (_isHourPickerShowing) {
            minuteText.style.color = 'gray';
        } else {
            minuteText.style.color = 'springgreen';
        }
    }

    function onClickMinuteText() {
        elementsEffect.blink(minuteText);

        if (_isHourPickerShowing) {
            
            _isHourPickerShowing = false;

            minutePickerPane.popPane(200);
            hourPickerPane.convergePane(100);
            refreshHourText();
            refreshMinuteText();
        }
    }
    
    initialize();
    
};


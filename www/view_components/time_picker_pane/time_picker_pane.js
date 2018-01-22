'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {


    this._time = time;
    var _this = this,
        paneFrame,
        clockFrame,
        hourPickerPane,
        minuteFrame,
        minuteChildFrame,
        minuteHandCanvas,
        hourText,
        minuteText,
        minuteMarks = [],
        subMinMarks = {},
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        viewComponents = returnvisitor.viewComponents,
        CLOCK_PANE_SIZE = 200,
        MINUTE_CLOCK_RADIUS = 80,
        POP_DURATION = 300,
        _isHourPickerShowing = true;
        
    
    function initialize() {

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            clockFrame = elements.getElementByClassName(paneFrame, 'clock_frame');

            initHourPickerPane();
            initMinuteFrame();
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
            convergeMinuteFrame();
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

            showUpMinuteFrame();
            hourPickerPane.convergePane(100);
            refreshHourText();
            refreshMinuteText();
        }
    }

    function initMinuteFrame() {

        minuteFrame = elements.getElementByClassName(paneFrame, 'minute_frame');
        initMinuteChildFrame();
        initMinuteHandCanvas();

        refreshMinutFrame();
    }

    function refreshMinutFrame() {

        if (_isHourPickerShowing) {

            minuteFrame.style.zIndex = 100;

        } else {

            minuteFrame.style.zIndex = 200;
        }
    }

    function showUpMinuteFrame() {

        _isHourPickerShowing = false;

        var $minFrame = $(minuteFrame);
        $minFrame.css({
            backgroundColor : 'transparent',
            width : 0,
            height : 0,
            zIndex : 200,
        });

        $minFrame.animate({
            width : '200px',
            height : '200px',
            borderRadius : '100px'
        }, POP_DURATION, 'easeOutQuint', function(){
            $minFrame.css({
                backgroundColor : 'white',
                borderRadius : 0
            });
        });

        popMinuteMarks();
        refreshHourText();
        refreshMinuteText();
    }

    function popMinuteMarks() {

        for ( var i = 0 ; i < minuteMarks.length ; i++ ) {

            var minMark = minuteMarks[i];
            var $mark = $(minMark.mark);
            $mark.css({
                top : 0,
                left : 0
            });

            var pos = minMark.positionOnMinuteFrame();
            $mark.animate({
                top : pos.y,
                left : pos.x
            }, POP_DURATION, 'easeOutQuint');
        }
    }

    function convergeMinuteFrame() {
        var $minFrame = $(minuteFrame);

        $minFrame.animate({
            borderRadius : '100px',
            width : 0,
            height : 0,
        }, POP_DURATION, 'easeOutQuint', function(){
            $minFrame.css({
                borderRadius : 0,
                width : '100%',
                height : '100%',
            });
        });

        convergeMinuteMarks();

    }

    function convergeMinuteMarks() {
        
        for ( var i = 0 ; i < minuteMarks.length ; i++ ) {

            var minMark = minuteMarks[i];
            var $mark = $(minMark.mark);
           
            $mark.animate({
                top : 0,
                left : 0
            }, POP_DURATION, 'easeOutQuint');
        }
    }


    function initMinuteChildFrame() {
        minuteChildFrame = elements.getElementByClassName(paneFrame, 'minute_child_frame');

        for ( var i = 0 ; i < 60 ; i++ ) {

            if (isMultiple5(i)) {
                var minMark = new MinuteMark(i);
                var pos = minMark.positionOnMinuteFrame();

                $(minMark.mark).css({
                    top : pos.y + 'px',
                    left : pos.x + 'px'
                });
                minuteMarks.push(minMark);
                minuteChildFrame.appendChild(minMark.mark);
            }
        }

        initMinuteChildFrameTouch();
    }

    function MinuteMark(n) {

        this.mark = document.createElement('div'); 

        this.mark.classList.add('minute_mark');
        this.mark.innerText = n;
        this.numValue = n;

    }

    MinuteMark.prototype.MARK_RADIUS = 12.5;
    MinuteMark.prototype.positionOnMinuteFrame = function() {

        var pos = coordinates.minuteToPositionFromCenter(this.numValue, MINUTE_CLOCK_RADIUS);
     
        return {
            x : CLOCK_PANE_SIZE / 2 + pos.x - this.MARK_RADIUS,
            y : CLOCK_PANE_SIZE / 2 - pos.y - this.MARK_RADIUS
        };
    };

    MinuteMark.prototype.blink = function(active) {

        var $mark = $(this.mark);

        if (active) {

            $mark.css({
                backgroundColor : 'white',
                color : 'springgreen'
            });
        } else {

            $mark.css({
                backgroundColor : 'springgreen',
                color : 'white'
            });
        }
    };

    function initMinuteChildFrameTouch() {

        var _isTouchDown = false; 

        if (cordova.platformId === 'android') {

            minuteChildFrame.addEventListener('touchstart', onTouchStart, {capture : false, passive : true});
            minuteChildFrame.addEventListener('touchmove', onTouchMove, {capture : false, passive : true});
            minuteChildFrame.addEventListener('touchcancel', onMouseLeave);
            minuteChildFrame.addEventListener('touchend', onMouseUp); 

        } else {

            minuteChildFrame.addEventListener('mousedown', onMouseDown);
            minuteChildFrame.addEventListener('mouseleave', onMouseLeave);
            minuteChildFrame.addEventListener('mousemove', onMouseMove);
            minuteChildFrame.addEventListener('mouseup', onMouseUp);    
        }

        function onMouseDown(e) {
            
            _isTouchDown = true;
            toMinuteSet(e);
        }



        function onMouseMove(e) {
            
            toMinuteSet(e);
        }

        function onMouseLeave() {
            _isTouchDown = false;
            clearMinMarks();
            clearOtherSubMarks();
            refreshMinuteHandCanvas();
        }

        function onMouseUp() {

            _isTouchDown = false;
            clearMinMarks();
            clearOtherSubMarks();
            refreshMinuteHandCanvas();

        }

        function onTouchStart(e) {

            // console.log('On touch start.');
            _isTouchDown = true;

            toMinuteSet(e);
        }

        function onTouchMove(e) {

            e.preventDefault();

            toMinuteSet(e);

        }

        function frameCenter() {
            var frameRect = minuteChildFrame.getBoundingClientRect();

            return {
                x : frameRect.left + CLOCK_PANE_SIZE / 2,
                y : frameRect. top + CLOCK_PANE_SIZE / 2
            };
        }

        function getPositionFromCenter(e) {

            var center = frameCenter();

            var pos = touchEventFilter.touchToPosition(e);

            return {
                x : center.x - pos.x,
                y : center.y - pos.y 
            };
        }

        function isInRange(dist) {
            return dist > 60 && dist < 100;
        }

        function toMinuteSet(e) {

            if (_isTouchDown) {
                var pos = getPositionFromCenter(e);

                if (isInRange(coordinates.distance(pos))) {
    
                    var min = coordinates.positionToMinute({
                        x : pos.x,
                        y : -pos.y
                    });

                    setMinute(min);
                } else {

                    clearMinMarks();
                    clearOtherSubMarks();
                    refreshMinuteHandCanvas();
                }
            }
        }
    }

    function clearMinMarks() {

        for ( var i = 0 ; i < minuteMarks.length ; i++ ) {
            minuteMarks[i].blink(false);
            minuteMarks[i].mark.style.zIndex = 200;
        }

    }

    function setMinute(min) {

        clearMinMarks();
        clearOtherSubMarks(min);
        refreshMinuteHandCanvas(min);
        
        if (isMultiple5(min)) {
            var minMark = minuteMarks[min / 5];
            minMark.blink(true);
            minMark.mark.style.zIndex = 400;

        } else {
            addSubMinuteMark(min);  
        }
        _this._time.setMinutes(min);
        refreshMinuteText();
    }

    function addSubMinuteMark(n) {

        var subMark = subMinMarks[n];

        if (!subMark) {
            subMark = new MinuteMark(n);
            subMinMarks[n] = subMark;
            minuteChildFrame.appendChild(subMark.mark);
            var pos = subMark.positionOnMinuteFrame();
            $(subMark.mark).css({
                zIndex : 300,
                top : pos.y + 'px',
                left : pos.x + 'px'
            });
        }

        subMark.mark.style.opacity = 1;

    }

    function clearOtherSubMarks(n) {

        // remove all submarks if n is undefined.

        for (var key in subMinMarks) {

            if (key != n) {

                var subMark = subMinMarks[key];
                subMark.mark.style.opacity = 0;
            } 
        }
    }


    function isMultiple5(n) {
        return parseInt( n / 5 ) * 5 == n; 
    }

    function initMinuteHandCanvas() {

        minuteHandCanvas = elements.getElementByClassName(paneFrame, 'minute_hand_canvas');
    }

    /**
     * 
     * @param {*} min If given undefined just clear canvas.
     */
    function refreshMinuteHandCanvas(min) {

        var centerX = CLOCK_PANE_SIZE / 2,
            centerY = CLOCK_PANE_SIZE / 2,
            ctx = minuteHandCanvas.getContext('2d');

        if (ctx) {

            ctx.clearRect(0, 0, 200, 200);

            if (min || min == 0) {
                ctx.fillStyle = 'springgreen';
                ctx.beginPath();
                ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
                ctx.fill();
    
                ctx.strokeStyle = 'springgreen';
                ctx.lineWidth = 20;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                var pos = minutePositionFromCenter(min);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
    
                setTimeout(removeDrawing, 50);
            }
        }

        var removeDrawing = function() {
            ctx.clearRect(0, 0, 200, 200);
        };

    }

    function minutePositionFromCenter(min) {

        var pos = coordinates.minuteToPositionFromCenter(min, MINUTE_CLOCK_RADIUS);

        return {
            x : CLOCK_PANE_SIZE / 2 + pos.x,
            y : CLOCK_PANE_SIZE / 2 - pos.y
        };
    }
    
    initialize();
    
};


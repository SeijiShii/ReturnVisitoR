'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {


    var _this = this,
        _time = time,
        paneFrame,
        hourFrame,
        minuteFrame,
        minuteHand,
        hourText,
        minuteText,
        hourChildFrames = [],
        hourButtons = [],
        minuteButtons = [],
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        HOUR_PREFIX = 'hour_button_',
        MINUTE_PREFIX = 'minute_button_',
        CLOCK_PANE_SIZE = 200,
        MINUTE_CLOCK_RADIUS = 80,
        HOUR_FRAME_ID_PREFIX = 'clock_hour_frame_',
        _isHourFrameShowing = true;
        
    
    function initialize() {

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            initHourFrame();
            initMinuteFrame();
            initMinuteHand();
            initHourText();
            initMinuteText();

            parent.appendChild(paneFrame);

            // waitCallbackReady();
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


    function initHourFrame() {
        
        hourFrame = elements.getElementByClassName(paneFrame, 'hour_frame');
        
        initHourChildFrames();
    }

    function initHourChildFrames() {

        var isActive = _time.getHours() <= 12,
            startTime = 1;
        for ( var i = 0 ; i < 2 ; i++ ) {
            
            var childFrame = generateHourChildFrame(startTime, isActive);
            childFrame.id = HOUR_FRAME_ID_PREFIX + i;
            hourChildFrames.push(childFrame);
            hourFrame.appendChild(childFrame);

            startTime += 12;
            isActive = !isActive;
        }
    }

    function generateHourChildFrame(startHour, isActive) {

        var hour = startHour;

        var frame = document.createElement('div');
        frame.classList.add('hour_child_frame');

        frame.style.zIndex = 100;
        if (isActive) {
            frame.style.zIndex = 200;
        }

        for ( var i = 0 ; i < 12 ; i++ ) {

            var ckButton = new HourButton(hour, isActive);

            var pos = ckButton.positionFromCenter();
            $(ckButton.button).css({
                top : (CLOCK_PANE_SIZE / 2 + pos.x) + 'px',
                left : (CLOCK_PANE_SIZE / 2 + pos.y) + 'px'
            });

            frame.appendChild(ckButton.button);
            hourButtons.push(ckButton);

            hour++;
        }

        frame.addEventListener('click', onClickHourChildFrame);

        return frame;
    }

    function onClickHourChildFrame(e) {

        var frame = touchEventFilter.getTarget(e, 'hour_child_frame');

        var frameIndex = frame.id.substring(HOUR_FRAME_ID_PREFIX.length);

        if (frameIndex == 0) {
            hourChildFrames[0].style.zIndex = 100;
            hourChildFrames[1].style.zIndex = 200;
        } else {
            hourChildFrames[0].style.zIndex = 200;
            hourChildFrames[1].style.zIndex = 100;
        }

        for ( var i = 0 ; i < 24 ; i++ ) {
            hourButtons[i].activate();
        }

    }

    function HourButton(n, isActive) {

        this.isActive = isActive;

        this.button = document.createElement('div');
        this.button.classList.add('hour_button');

        $(this.button).css(this.sizeOptions());

        this.numValue = n;
        this.button.innerText = n;
        this.button.id = HOUR_PREFIX + n;
        this.button.addEventListener('click', onClickHourButton, true);
   
    }

    function onClickHourButton(e) {

        e.stopPropagation();

        var button = touchEventFilter.getTarget(e, 'hour_button');
        elementsEffect.blink(button);
        elementsEffect.shrink(button);
        var hour = touchEventFilter.getTargetId(e, 'hour_button').substring(HOUR_PREFIX.length);

        _time.setHours(hour);

        refreshHourText();

    }

    HourButton.prototype.activate = function() {

        this.isActive = !this.isActive;

        var pos = this.positionFromCenter();

        $(this.button).animate({
            top : (CLOCK_PANE_SIZE / 2 + pos.x) + 'px',
            left : (CLOCK_PANE_SIZE / 2 + pos.y) + 'px'
        }, 300, 'easeOutQuint');

        $(this.button).animate(this.sizeOptions, 300, 'easeOutQuint');
    };

    HourButton.prototype.positionFromCenter = function() {
        var pos;

        pos = coordinates.byHour(this.numValue, this.clockRadius());

        return {
            x : pos.x - this.buttonRadius(),
            y : pos.y - this.buttonRadius()
        };
    };

    HourButton.prototype.clockRadius = function() {
        if (this.isActive) {
            return 80;
        } else {
            return 60;
        }
    };

    HourButton.prototype.buttonRadius = function() {
        if (this.isActive) {
            return 15;
        } else {
            return 13;
        }
    };

    HourButton.prototype.sizeOptions = function() {

        return {
            width : this.buttonRadius() * 2 + 'px',
            height : this.buttonRadius() * 2 + 'px',
            borderRadius : this.buttonRadius() + 'px',
            fontSize : this.buttonRadius() + 'px',
            lineHeight : this.buttonRadius() * 2 + 'px'
        };

    };

    function initHourText() {
        hourText = elements.getElementByClassName(paneFrame, 'hour_text');
        refreshHourText();
        hourText.addEventListener('click', onClickHourText);
    }
    
    function refreshHourText() {
        hourText.innerText = _time.getHours();
        if (_isHourFrameShowing) {
            hourText.style.color = 'springgreen';
        } else {
            hourText.style.color = 'gray';
        }
    }

    function onClickHourText() {
        elementsEffect.blink(hourText);
        showUpHourFrame();

    }

    function initMinuteText() {
        minuteText = elements.getElementByClassName(paneFrame, 'minute_text');
        refreshMinuteText();
        minuteText.addEventListener('click', onClickMinuteText);
    }

    function refreshMinuteText() {
        minuteText.innerText = _time.getPaddedMinutes();
        if (_isHourFrameShowing) {
            minuteText.style.color = 'gray';
        } else {
            minuteText.style.color = 'springgreen';
        }
    }

    function onClickMinuteText() {
        elementsEffect.blink(minuteText);
        showUpMinuteFrame();
    }

    function showUpHourFrame() {

    }

    function showUpMinuteFrame() {

    }

    function initMinuteFrame() {
        minuteFrame = elements.getElementByClassName(paneFrame, 'minute_frame');

        for ( var i = 0 ; i < 60 ; i++ ) {
            var minuteButton = new MinuteButton(i);
            var pos = minuteButton.positionFromCenter();
            $(minuteButton.button).css({
                top : (CLOCK_PANE_SIZE / 2 + pos.x) + 'px',
                left : (CLOCK_PANE_SIZE / 2 + pos.y) + 'px'
            });

            minuteButtons.push(minuteButton);
            minuteFrame.appendChild(minuteButton.button);
        }
    }

    function MinuteButton(n) {

        this.button = document.createElement('div'); 

        this.button.classList.add('minute_button');
        if ( isMultiple5(n) ) {
            this.button.classList.add('minute_multiple_5');
            this.button.innerText = n;
        }

        this.numValue = n;
        this.button.id = MINUTE_PREFIX + n;

        var touch = new MinuteButtonTouch(this);
        touch.onTouchUp = function(minButton) {
            console.log(minButton.numValue);
        };
    }

    MinuteButton.prototype.positionFromCenter = function() {

        var pos = coordinates.byMinute(this.numValue, MINUTE_CLOCK_RADIUS);
        
        return {
            x : pos.x - this.buttonRadius(),
            y : pos.y - this.buttonRadius()
        };
    };

    MinuteButton.prototype.buttonRadius = function() {

        if (isMultiple5(this.numValue)) {
            return 12.5;
        } else {
            return 7.5;
        }
    };

    var isMinButtonTouchDown = false;
    function MinuteButtonTouch(minuteButton) {

        var _this = this,
            button = minuteButton.button;

        button.addEventListener('mousedown', onMouseDown);
        button.addEventListener('mouseenter', onMouseEnter);
        button.addEventListener('mouseleave', onMouseLeave);
        button.addEventListener('mouseup', onMouseUp);

        function onMouseDown(e) {
            var minButton = getButton(e);
            isMinButtonTouchDown = true;
            activateButton(minButton, true);

            refreshMinuteHand(minButton.numValue, true);
        }

        function onMouseEnter(e) {

            var minButton = getButton(e);

            console.log('Mouse enter to ' + minButton.numValue);
            console.log('minButton.isTouchDown: ' + isMinButtonTouchDown);

            if (isMinButtonTouchDown) {
                activateButton(minButton, true);
                refreshMinuteHand(minButton.numValue, true);
            }

        }

        function onMouseLeave(e) {

            var minButton = getButton(e);

            if (isMinButtonTouchDown) {
                activateButton(minButton, false);
                refreshMinuteHand(minButton.numValue, false);

            }
        }

        function onMouseUp(e) {

            var minButton = getButton(e);

            isMinButtonTouchDown = false;
            activateButton(minButton, false);
            refreshMinuteHand(minButton.numValue, false);

            if ( typeof _this.onTouchUp === 'function' ) {
                _this.onTouchUp(minButton);
            }
        }

        function getButton(e) {
            var button = touchEventFilter.getTarget(e, 'minute_button');
            var numValue = button.id.substring(MINUTE_PREFIX.length);

            return minuteButtons[numValue];
        }

        function activateButton(minuteButton, active) {

            var $button = $(minuteButton.button);

            if (isMultiple5(minuteButton.numValue)) {

                if (active) {

                    $button.css({
                        backgroundColor : 'white',
                        color : 'springgreen'
                    });
                } else {

                    $button.css({
                        backgroundColor : 'springgreen',
                        color : 'white'
                    });
                }

            } else {

                if (active) {

                    $button.css({
                        backgroundColor : 'springgreen',
                    });
                } else {

                    $button.css({
                        backgroundColor : 'transparent',
                    });
                }

            }
        }
    }

    function initMinuteHand() {
        minuteHand = elements.getElementByClassName(paneFrame, 'minute_hand');
    }

    function refreshMinuteHand(min, show) {

        var $hand = $(minuteHand),
            degree = coordinates.minToDegree(min) + 90;

        $hand.css({
            transform : 'rotate(' + degree + 'deg)'
        });

        if (show) {
            minuteHand.style.opacity = 1;
        } else {
            minuteHand.style.opacity = 0;
        }
        
    }


    function isMultiple5(n) {
        return parseInt( n / 5 ) * 5 == n; 
    }
    
    initialize();
    
};


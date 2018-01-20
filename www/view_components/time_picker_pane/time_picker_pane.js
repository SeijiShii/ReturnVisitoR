"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {

    var _this = this,
        _time = time,
        paneFrame,
        // clockFrame,
        hourFrame,
        hourText,
        hourChildFrames = [],
        clockButtons = [],
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        HOUR_PREFIX = 'hour_button_',
        CLOCK_PANE_SIZE = 200,
        HOUR_FRAME_ID_PREFIX = 'clock_hour_frame_'
        ;
    
    function initialize() {

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            initHourFrame();
            initHourText();

            parent.appendChild(paneFrame);

            // waitCallbackReady();
        })

    }

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
            console.log('Waiting time picker pane callback ready for ' + counter + 'ms.');
        }
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

            var ckButton = new ClockButton(hour, isActive);

            var pos = ckButton.positionFromCenter();
            $(ckButton.button).css({
                top : (CLOCK_PANE_SIZE / 2 + pos.x) + 'px',
                left : (CLOCK_PANE_SIZE / 2 + pos.y) + 'px'
            });

            frame.appendChild(ckButton.button);
            clockButtons.push(ckButton);

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
            clockButtons[i].activate();
        }

    }

    function ClockButton(n, isActive) {

        this.isActive = isActive;

        this.button = document.createElement('div');
        this.button.classList.add('hour_button');

        $(this.button).css(this.sizeOptions());

        this.numValue = n;
        this.button.innerText = n;
        this.button.id = HOUR_PREFIX + n;
        this.button.addEventListener('click', onClickClockButton, true);
   
    }

    function onClickClockButton(e) {

        e.stopPropagation();

        var button = touchEventFilter.getTarget(e, 'hour_button');
        elementsEffect.blink(button);
        elementsEffect.shrink(button);
        var hour = touchEventFilter.getTargetId(e, 'hour_button').substring(HOUR_PREFIX.length);

        _time.setHours(hour);

        refreshHourText();

    }

    ClockButton.prototype.activate = function() {

        this.isActive = !this.isActive;

        var pos = this.positionFromCenter();

        $(this.button).animate({
            top : (CLOCK_PANE_SIZE / 2 + pos.x) + 'px',
            left : (CLOCK_PANE_SIZE / 2 + pos.y) + 'px'
        }, 300, 'easeOutQuint');

        $(this.button).animate(this.sizeOptions, 300, 'easeOutQuint');
    }

    ClockButton.prototype.positionFromCenter = function() {
        var pos;

        pos = coordinates.byHour(this.numValue, this.clockRadius());

        return {
            x : pos.x - this.buttonRadius(),
            y : pos.y - this.buttonRadius()
        }
    }

    ClockButton.prototype.clockRadius = function() {
        if (this.isActive) {
            return 80;
        } else {
            return 60;
        }
    }

    ClockButton.prototype.buttonRadius = function() {
        if (this.isActive) {
            return 15;
        } else {
            return 13;
        }
    }

    ClockButton.prototype.sizeOptions = function() {

        return {
            width : this.buttonRadius() * 2 + 'px',
            height : this.buttonRadius() * 2 + 'px',
            borderRadius : this.buttonRadius() + 'px',
            fontSize : this.buttonRadius() + 'px',
            lineHeight : this.buttonRadius() * 2 + 'px'
        };

    }

    function initHourText() {
        hourText = elements.getElementByClassName(paneFrame, 'hour_text');
        refreshHourText();
    }
    
    function refreshHourText() {
        hourText.innerText = _time.getHours();
    }

    initialize();
    
}


'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {


    this.time = time;
    var _this = this,
        paneFrame,
        hourFrame,
        minuteFrame,
        minuteChildFrame,
        minuteHandCanvas,
        hourText,
        minuteText,
        hourChildFrames = [],
        hourButtons = [],
        minuteMarks = [],
        subMinMarks = {},
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        HOUR_PREFIX = 'hour_button_',
        // MINUTE_PREFIX = 'minute_button_',
        CLOCK_PANE_SIZE = 200,
        MINUTE_CLOCK_RADIUS = 80,
        POP_DURATION = 300,
        HOUR_FRAME_ID_PREFIX = 'clock_hour_frame_',
        _isHourFrameShowing = true;
        
    
    function initialize() {

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            initHourFrame();
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


    function initHourFrame() {
        
        hourFrame = elements.getElementByClassName(paneFrame, 'hour_frame');
        refreshHourFrame();
        
        initHourChildFrames();
    }

    function refreshHourFrame() {

        if (_isHourFrameShowing) {
            hourFrame.style.zIndex = 200;
        } else {
            hourFrame.style.zIndex = 100;
        }
    }

    function initHourChildFrames() {

        var isActive = _this.time.getHours() <= 12,
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

            var pos = ckButton.positionOnHourFrame();

            // console.log(hour, pos.x, pos.y);

            $(ckButton.button).css({
                left : pos.x + 'px',
                top : pos.y + 'px'
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

        _this.time.setHours(hour);

        refreshHourText();

    }

    HourButton.prototype.activate = function() {

        this.isActive = !this.isActive;

        var pos = this.positionOnHourFrame();

        $(this.button).animate({
            top : pos.y + 'px',
            left : pos.x + 'px'
        }, 300, 'easeOutQuint');

        $(this.button).animate(this.sizeOptions, 300, 'easeOutQuint');
    };

    HourButton.prototype.positionOnHourFrame = function() {
        var pos;

        pos = coordinates.hourToPostionFromCenter(this.numValue, this.clockRadius());

        // console.log(this.numValue, pos.x, pos.y);

        return {
            x : (CLOCK_PANE_SIZE / 2) + pos.x - this.buttonRadius(),
            y : (CLOCK_PANE_SIZE / 2) - pos.y - this.buttonRadius()
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
        hourText.innerText = _this.time.getHours();
        if (_isHourFrameShowing) {
            hourText.style.color = 'springgreen';
        } else {
            hourText.style.color = 'gray';
        }
    }

    function onClickHourText() {
        elementsEffect.blink(hourText);

        if (!_isHourFrameShowing) {
            showUpHourFrame();
        }

    }

    function initMinuteText() {
        minuteText = elements.getElementByClassName(paneFrame, 'minute_text');
        refreshMinuteText();
        minuteText.addEventListener('click', onClickMinuteText);
    }

    function refreshMinuteText() {
        minuteText.innerText = _this.time.getPaddedMinutes();
        if (_isHourFrameShowing) {
            minuteText.style.color = 'gray';
        } else {
            minuteText.style.color = 'springgreen';
        }
    }

    function onClickMinuteText() {
        elementsEffect.blink(minuteText);

        if (_isHourFrameShowing) {
            showUpMinuteFrame();
        }
    }

    function initMinuteFrame() {

        minuteFrame = elements.getElementByClassName(paneFrame, 'minute_frame');
        initMinuteChildFrame();
        initMinuteHandCanvas();

        refreshMinutFrame();
    }

    function refreshMinutFrame() {

        if (_isHourFrameShowing) {

            minuteFrame.style.zIndex = 100;

        } else {

            minuteFrame.style.zIndex = 200;
        }
    }

    function showUpHourFrame() {

        _isHourFrameShowing = true;

        var $hourFrame = $(hourFrame);

        $hourFrame.css({
            backgroundColor : 'transparent',
            width : 0,
            height : 0,
            zIndex : 200,
        });

        minuteFrame.style.zIndex = 100;

        $hourFrame.animate({
            width : '200px',
            height : '200px',
            borderRadius : '100px'
        }, POP_DURATION, 'easeOutQuint', function(){
            $hourFrame.css({
                borderRadius : 0,
                backgroundColor : 'white'
            });
        });

        convergeMinuteFrame();
        popHourButtons();
        refreshHourText();
        refreshMinuteText();
        
    }

    function convergeHourFrame() {

        var $hourFrame = $(hourFrame);

        $hourFrame.animate({
            borderRadius : '100px',
            width : 0,
            height : 0,
        }, POP_DURATION, 'easeOutQuint',function(){
            $hourFrame.css({
                borderRadius : 0,
                width : '100%',
                height : '100%'
            });
        });

        convergHourButtons();

    }

    function popHourButtons() {

        for ( var i = 0 ; i < hourButtons.length ; i++ ) {

            var hButton = hourButtons[i];
            var $button = $(hButton.button);

            $button.css({
                top : 0,
                left : 0
            });

            var pos = hButton.positionOnHourFrame();

            $button.animate({
                top : pos.y,
                left : pos.x
            }, POP_DURATION, 'easeOutQuint');

        }

    }

    function convergHourButtons() {

        for ( var i = 0 ; i < hourButtons.length ; i++ ) {

            var hButton = hourButtons[i];
            var $button = $(hButton.button);

            $button.animate({
                top : 0,
                left : 0
            }, POP_DURATION, 'easeOutQuint');

        }
    }

    function showUpMinuteFrame() {

        _isHourFrameShowing = false;

        var $minFrame = $(minuteFrame);
        $minFrame.css({
            backgroundColor : 'transparent',
            width : 0,
            height : 0,
            zIndex : 200,
        });

        hourFrame.style.zIndex = 100;

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

        convergeHourFrame();
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

                // console.log(i, pos.x, pos.y);

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
        _this.time.setMinutes(min);
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


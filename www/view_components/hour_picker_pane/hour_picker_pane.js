'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.hourPickerPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        elementsEffect = common.elementsEffect,
        hourFrame,
        hourChildFrames = [],
        hourButtons = [],
        HOUR_PREFIX = 'hour_button_',
        HOUR_FRAME_ID_PREFIX = 'clock_hour_frame_',
        FRAME_SIZE = 200,
        POP_DURATION = 300,
        _onClickHourButton,
        _zIndex,
        _initialHour;

    function _initialize(parent, initialHour, zIndex) {

        _zIndex = zIndex;
        if (!_zIndex) {
            _zIndex = 0;
        }

        _initialHour = initialHour;
        if (!_initialHour) {
            _initialHour = 12;
        }

        loadFile.loadCss('./view_components/hour_picker_pane/hour_picker_pane.css');

        initHourFrame();
        initHourChildFrames();
        
        parent.appendChild(hourFrame);

    }

    function initHourFrame() {
        
        hourFrame = document.createElement('div');
        hourFrame.classList.add('hour_frame');
        hourFrame.style.zIndex = _zIndex;

    }

    function initHourChildFrames() {

        var isActive = _initialHour <= 12,
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

        this.numValue = n;
        this.button.innerText = n;
        this.button.id = HOUR_PREFIX + n;

        $(this.button).css(this.sizeOptions());
        this.button.blink = new elementsEffect.Blink(this.button);
        this.button.addEventListener('click', onClickHourButton, true);
   
    }

    function onClickHourButton(e) {

        e.stopPropagation();

        var button = touchEventFilter.getTarget(e, 'hour_button');
        elementsEffect.shrink(button);
        var hour = touchEventFilter.getTargetId(e, 'hour_button').substring(HOUR_PREFIX.length);

        if ( typeof _onClickHourButton === 'function' ) {
            _onClickHourButton(hour);
        }

    }

    HourButton.prototype.activate = function() {

        this.isActive = !this.isActive;

        var pos = this.positionOnHourFrame();

        var options = this.sizeOptions();
        options.top = pos.y + 'px';
        options.left = pos.x + 'px';

        $(this.button).animate(options, 300, 'easeOutQuint');
    };

    HourButton.prototype.positionOnHourFrame = function() {
        var pos;

        pos = coordinates.hourToPostionFromCenter(this.numValue, this.clockRadius());

        // console.log(this.numValue, pos.x, pos.y);

        return {
            x : (FRAME_SIZE / 2) + pos.x - this.buttonRadius(),
            y : (FRAME_SIZE / 2) - pos.y - this.buttonRadius()
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

    function _popHourFrame(zIndex) {

        var $hourFrame = $(hourFrame);

        $hourFrame.css({
            zIndex : zIndex,
            backgroundColor : 'transparent',
            width : 0,
            height : 0,
            opacity : 0
        });

        $hourFrame.animate({
            width : '200px',
            height : '200px',
            borderRadius : '100px',
            opacity  : 1

        }, POP_DURATION, 'easeOutQuint', function(){
            $hourFrame.css({
                borderRadius : 0,
                backgroundColor : 'white'
            });
        });

        popHourButtons();
        
    }

    function _convergeHourFrame(zIndex) {

        var $hourFrame = $(hourFrame);

        $hourFrame.animate({
            borderRadius : '100px',
            width : 0,
            height : 0,
            zIndex : zIndex,
            opacity : 0

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

    return {
      
        initialize : _initialize,

        set onClickHourButton(f) {
            _onClickHourButton = f;
        },

        popPane : _popHourFrame,
        convergePane : _convergeHourFrame

    };

})();
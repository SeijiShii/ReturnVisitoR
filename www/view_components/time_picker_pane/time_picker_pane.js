"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.TimePickerPane = function(parent, time) {

    var _this = this,
        _time = time,
        paneFrame,
        // clockFrame,
        hourFrame,
        hourChildFrames = [],
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        coordinates = common.coordinates,
        HOUR_PREFIX = 'hour_button_',
        CLOCK_PANE_SIZE = 200
        ;
    
    function initialize() {

        loadFile.loadCss('./view_components/time_picker_pane/time_picker_pane.css');
        loadFile.loadHtmlAsElement('./view_components/time_picker_pane/time_picker_pane.html', function(elm){
            paneFrame = elm;

            initHourFrame();

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
        // initHour12Frame();
        // initHour24Frame();
    }

    function initHourChildFrames() {

        var isActive = _time.getHours() <= 12,
            startTime = 1;
        for ( var i = 0 ; i < 2 ; i++ ) {
            
            var childFrame = generateHourChildFrame(startTime, isActive);
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

            hour++;
        }

        return frame;
    }

    function ClockButton(n, isActive) {

        this.isActive = isActive;

        this.button = document.createElement('div');
        this.button.classList.add('clock_button');

        if (!this.isActive) {
            $(this.button).css({
                width : this.INNACTIVE_BUTTON_RADIUS * 2 + 'px',
                height : this.INNACTIVE_BUTTON_RADIUS * 2 + 'px'
            });
        }

        this.numValue = n;
        this.button.innerText = n;
        this.button.id = HOUR_PREFIX + n;

   
    }

    ClockButton.prototype.positionFromCenter = function() {
        var pos,
            radius = this.ACTIVE_BUTTON_RADIUS;
        ;

        if (this.isActive) {
            pos = coordinates.byHour(this.numValue, this.ACTIVE_RADIUS);
        } else {
            pos = coordinates.byHour(this.numValue, this.INNACTIVE_RADIUS);
            radius = this.INNACTIVE_BUTTON_RADIUS;
        }

        return {
            x : pos.x - radius,
            y : pos.y - radius
        }
    }

    ClockButton.prototype.activate = function(toBeActive) {

        this.isActive = toBeActive;

        var pos = this.positionFromCenter();

        $(this.button).animate({
            top : pos.y,
            left : pos.x
        }, 300)
    }

    ClockButton.prototype.ACTIVE_RADIUS = 80;
    ClockButton.prototype.INNACTIVE_RADIUS = 60;
    ClockButton.prototype.ACTIVE_BUTTON_RADIUS = 15;
    ClockButton.prototype.INNACTIVE_BUTTON_RADIUS = 13;
    

    initialize();
    
}


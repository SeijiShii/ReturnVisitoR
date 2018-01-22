'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.minutePickerPane = (function(){

    var minuteFrame,
        minuteMarkFrame,
        minuteHandCanvas,
        minuteMarks = [],
        subMinMarks = {},
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile = common.loadFile,
        elements = common.elements,
        coordinates = common.coordinates,
        touchEventFilter = common.touchEventFilter,
        PANE_SIZE = 200,
        MINUTE_CLOCK_RADIUS = 80,
        POP_DURATION = 300,
        _zIndex,
        _onMinuteSet,
        _parent;

        
    function _initialize(parent, zIndex) {

        loadFile.loadCss('./view_components/minute_picker_pane/minute_picker_pane.css');

        _parent = parent;

        _zIndex = zIndex;
        if (!_zIndex) {
            _zIndex = 0;
        }

        initMinuteFrame();

    }
    
    function initMinuteFrame() {

        minuteFrame = document.createElement('div');
        minuteFrame.classList.add('minute_frame');
        minuteFrame.style.zIndex = _zIndex;
        
        _parent.appendChild(minuteFrame);

        initMinuteChildFrame();
        initMinuteHandCanvas();
    
    }
    
    function _popPane(zIndex) {
    
        var $minFrame = $(minuteFrame);
        $minFrame.css({
            backgroundColor : 'transparent',
            width : 0,
            height : 0,
            zIndex : zIndex,
            opacity : 0,

        });
    
        $minFrame.animate({
            width : '200px',
            height : '200px',
            borderRadius : '100px',
            opacity : 1

        }, POP_DURATION, 'easeOutQuint', function(){
            $minFrame.css({
                backgroundColor : 'white',
                borderRadius : 0
            });
        });
    
        popMinuteMarks();
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
    
    function _convergePane(zIndex) {

        var $minFrame = $(minuteFrame);
    
        $minFrame.animate({
            borderRadius : '100px',
            width : 0,
            height : 0,
            zIndex : zIndex,
            opacity : 0

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

        minuteMarkFrame = document.createElement('div');
        minuteMarkFrame.classList.add('minute_mark_frame');
        minuteFrame.appendChild(minuteMarkFrame);
    
        for ( var i = 0 ; i < 60 ; i++ ) {
    
            if (isMultiple5(i)) {
                var minMark = new MinuteMark(i);
                var pos = minMark.positionOnMinuteFrame();
    
                $(minMark.mark).css({
                    top : pos.y + 'px',
                    left : pos.x + 'px'
                });
                minuteMarks.push(minMark);
                minuteMarkFrame.appendChild(minMark.mark);
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
            x : PANE_SIZE / 2 + pos.x - this.MARK_RADIUS,
            y : PANE_SIZE / 2 - pos.y - this.MARK_RADIUS
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
    
            minuteMarkFrame.addEventListener('touchstart', onTouchStart, {capture : false, passive : true});
            minuteMarkFrame.addEventListener('touchmove', onTouchMove, {capture : false, passive : true});
            minuteMarkFrame.addEventListener('touchcancel', onMouseLeave);
            minuteMarkFrame.addEventListener('touchend', onMouseUp); 
    
        } else {
    
            minuteMarkFrame.addEventListener('mousedown', onMouseDown);
            minuteMarkFrame.addEventListener('mouseleave', onMouseLeave);
            minuteMarkFrame.addEventListener('mousemove', onMouseMove);
            minuteMarkFrame.addEventListener('mouseup', onMouseUp);    
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
            var frameRect = minuteMarkFrame.getBoundingClientRect();
    
            return {
                x : frameRect.left + PANE_SIZE / 2,
                y : frameRect. top + PANE_SIZE / 2
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

        if ( typeof _onMinuteSet === 'function' ) {
            _onMinuteSet(min);
        }
    }
    
    function addSubMinuteMark(n) {
    
        var subMark = subMinMarks[n];
    
        if (!subMark) {
            subMark = new MinuteMark(n);
            subMinMarks[n] = subMark;
            minuteMarkFrame.appendChild(subMark.mark);
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

        // Canvas only can set size in HTML not in css or others.
        var wrapper = document.createElement('div');
        wrapper.innerHTML = '<canvas class="minute_hand_canvas" width="200px" height="200px"></canvas>';
    
        minuteHandCanvas = elements.getElementByClassName(wrapper, 'minute_hand_canvas'); 
    
        minuteFrame.appendChild(minuteHandCanvas);
    }
    
    /**
     * 
     * @param {*} min If given undefined just clear canvas.
     */
    function refreshMinuteHandCanvas(min) {
    
        var centerX = PANE_SIZE / 2,
            centerY = PANE_SIZE / 2,
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
            x : PANE_SIZE / 2 + pos.x,
            y : PANE_SIZE / 2 - pos.y
        };
    }
    
    return {
        initialize      : _initialize,
        popPane         : _popPane,
        convergePane    : _convergePane,

        set onMinuteSet(f) {
            _onMinuteSet = f;
        }
    };
})();


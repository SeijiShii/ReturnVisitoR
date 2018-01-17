"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.CalendarPane = function(parent, date) {

    var _this = this,
        returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        SwipePane       = viewComponents.SwipePane,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        dateTime        = common.dateTime,
        elementsEffect  = common.elementsEffect,
        paneFrame,
        montText,
        leftButton,
        rightButton,
        calendarFrame,
        swipePane,
        _date = date,
        HEADER_HEIGHT_NUM = 45
        ;

    function initialize() {

        if (_date === undefined) {
            _date = new Date();
        }

        loadFile.loadCss('./view_components/calendar_pane/calendar_pane.css');
        loadFile.loadHtmlAsElement('./view_components/calendar_pane/calendar_pane.html', function(elm){
            paneFrame = elm;

            parent.appendChild(paneFrame);

            initMontText();
            initLeftButton();
            initRightButton();
            initCalendarFrame();
        });
    }

    function initMontText() {
        montText = elements.getElementByClassName(paneFrame, 'month_text');

        refreshMonthText();
    }

    function initLeftButton() {
        leftButton = elements.getElementByClassName(paneFrame, 'left_button');
        leftButton.addEventListener('click', onLeftClick);
        
    }

    function onLeftClick() {
        elementsEffect.blink(leftButton);
    }

    function initRightButton() {
        rightButton = elements.getElementByClassName(paneFrame, 'right_button');
        rightButton.addEventListener('click', onRightClick);

    }

    function onRightClick() {
        elementsEffect.blink(rightButton);
    }


    function refreshMonthText() {
        montText.innerText = dateTime.monthString(_date);
    }

    function initCalendarFrame() {
        calendarFrame = elements.getElementByClassName(paneFrame, 'calendar_frame');

        resizeCalendarFrame();

        swipePane = new SwipePane(calendarFrame);
    }

    function resizeCalendarFrame() {
        calendarFrame.style.height = (paneFrame.clientHeight - HEADER_HEIGHT_NUM ) + 'px';
    }

    this.resizePane =function() {

        if (calendarFrame) {
            resizeCalendarFrame();
        }
    }


    initialize();
}
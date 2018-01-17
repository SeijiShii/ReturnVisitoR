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
        calendarFramePane,
        _date = date,
        HEADER_HEIGHT_NUM = 45,
        calendarFrames = [];
        ;
    
    this.isMondayStart = true;

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
        calendarFramePane.shiftToLeft();
    }

    function initRightButton() {
        rightButton = elements.getElementByClassName(paneFrame, 'right_button');
        rightButton.addEventListener('click', onRightClick);

    }

    function onRightClick() {
        elementsEffect.blink(rightButton);
        calendarFramePane.shiftToRight();
    }


    function refreshMonthText() {
        montText.innerText = dateTime.monthString(_date);
    }

    function initCalendarFrame() {
        calendarFrame = elements.getElementByClassName(paneFrame, 'calendar_frame');

        resizeCalendarFrame();

        calendarFramePane = new SwipePane(calendarFrame);

        calendarFramePane.onPaneReady = function() {
            setCurrentCalendar();
            setLastCalendar();
            setNextCalendar();
        }        
    }

    function resizeCalendarFrame() {
        calendarFrame.style.height = (paneFrame.clientHeight - HEADER_HEIGHT_NUM ) + 'px';
    }

    function functionInitCalendarFrames() {

        var date0 = dateTime.clonedDate(_date);
        dateTime.addMonth(date0 , -1);
        calendarFrames.push(new CalendarFrame(date0));

        var date1 = dateTime.clonedDate(_date);
        calendarFrames.push(new CalendarFrame(date1));

        var date2 = dateTime.clonedDate(_date);
        dateTime.addMonth(date2, 1);
        calendarFrames.push(new CalendarFrame(date2));


    } 

    function setCurrentCalendar() {

        var currentCalendar = new CalendarFrame(_date);
        calendarFramePane.setCenterContent(currentCalendar);
    }

    function setLastCalendar() {

        var lastMonth = dateTime.clonedDate(_date);

        dateTime.addMonth(lastMonth, -1);

        var lastCalendar = new CalendarFrame(lastMonth);

        calendarFramePane.setLeftContent(lastCalendar);
    }

    function setNextCalendar() {

        var nextMonth = dateTime.clonedDate(_date);

        dateTime.addMonth(nextMonth, 1);

        var nextCalendar = new CalendarFrame(nextMonth);

        calendarFramePane.setRightContent(nextCalendar);
    }

    

    this.resizePane =function() {

        if (paneFrame) {
            paneFrame.style.height = (paneFrame.paner)
        }

        if (calendarFrame) {
            resizeCalendarFrame();
        }
    }

    var CalendarFrame = function(date) {

        this.date = dateTime.clonedDate(date);

        var table = document.createElement('table');
        table.classList.add('calendar_table');

        var daysHeader = document.createElement('tr');
        daysHeader.classList.add('days_header');
        table.appendChild(daysHeader);

        // Days header
        var sunday = new Date();
        sunday = dateTime.addedDate(sunday, -sunday.getDay())

        var days = [];
        for (var i = 0 ; i < 7 ; i++) {
            days.push(dateTime.dayString(dateTime.addedDate(sunday, i)));
        }

        if (_this.isMondayStart) {
            var first = days.shift();
            days.push(first);
        }

        for ( var i = 0 ; i < 7 ; i++ ) {
            var dayTD = document.createElement('td');
            dayTD.innerText = days[i];
            daysHeader.appendChild(dayTD);
        }

        // Calendar rows

        var yearMonth = date.getFullYear() * 12 + date.getMonth();
        this.date.setDate(1);
        
        if (_this.isMondayStart) {
            dateTime.setMonday(this.date);
        } else {
            dateTime.setSunday(this.date);
        }

        while ( yearMonth >= this.date.getFullYear() * 12 + this.date.getMonth()) {

            var calRow = document.createElement('tr');
            calRow.classList.add('calendar_row');

            table.appendChild(calRow);

            for ( var i = 0 ; i < 7 ; i++ ) {

                var calDT = document.createElement('td');

                if (yearMonth == this.date.getFullYear() * 12 + this.date.getMonth()) {
                    calDT.innerText = this.date.getDate();
                } else {
                    calDT.innerText = '';
                    calDT.classList.add('empty');
                }

                calRow.appendChild(calDT);
                dateTime.addDate(this.date, 1)
            }

            // console.log(cal.toDateString());
            
        }

        var calendarBase = document.createElement('div');
        calendarBase.classList.add('calendar_base');
        calendarBase.appendChild(table);

        return calendarBase;
     
    }


    initialize();
}
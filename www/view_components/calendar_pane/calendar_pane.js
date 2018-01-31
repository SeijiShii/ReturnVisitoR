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
        elementsEffect  = common.elementsEffect,
        touchEventFilter = common.touchEventFilter,
        paneFrame,
        monthText,
        calendarFrame,
        calendarFramePane,
        _date = date,
        DATE_CELL_PREFIX = 'date_cell_',
        HEADER_HEIGHT_NUM = 45;
        // calendarFrames = [];
    
    this.isMondayStart = true;

    function initialize() {

        if (_date === undefined) {
            _date = new Date();
        }

        loadFile.loadCss('./view_components/calendar_pane/calendar_pane.css');
        loadFile.loadHtmlAsElement('./view_components/calendar_pane/calendar_pane.html', function(elm){
            paneFrame = elm;

            parent.appendChild(paneFrame);

            initMonthText();
            initLeftButton();
            initRightButton();
            initCalendarFrame();

        });
    }

    function initMonthText() {
        monthText = elements.getElementByClassName(paneFrame, 'month_text');

        refreshMonthText();
    }

    function initLeftButton() {
        var leftButton = elements.getElementByClassName(paneFrame, 'left_button');
        leftButton.blink = new elementsEffect.Blink(leftButton);
        leftButton.addEventListener('click', onLeftClick);
        
    }

    function onLeftClick() {
        calendarFramePane.animateToShowLeftContent();
    }

    function initRightButton() {
        var rightButton = elements.getElementByClassName(paneFrame, 'right_button');
        rightButton.blink = new elementsEffect.Blink(rightButton);
        rightButton.addEventListener('click', onRightClick);

    }

    function onRightClick() {
        
        calendarFramePane.animateToShowRightContent();
    }


    function refreshMonthText() {
        monthText.innerText = _date.monthString();
    }

    function initCalendarFrame() {
        calendarFrame = elements.getElementByClassName(paneFrame, 'calendar_frame');

        resizeCalendarFrame();

        calendarFramePane = new SwipePane(calendarFrame);

        calendarFramePane.onInnerFrameReady = function() {
            setCalendarContents();
        }

        calendarFramePane.onShiftContentInInnerFrame = function(centerContent, toLeft) {

            // console.log(centerContent.date.toDateString());
            _date = centerContent.date;
            refreshMonthText();

            var clonedMonth = centerContent.date.clone();

            if (toLeft) {
                // Add right content (next month)
                clonedMonth.addMonth(1);

            } else {
                // Add left contetn (last month)
                clonedMonth.addMonth(-1);
            }

            return new CalendarContent(clonedMonth);
        }
    }

    function resizeCalendarFrame() {
        calendarFrame.style.height = (paneFrame.clientHeight - HEADER_HEIGHT_NUM ) + 'px';
    }

    function setCalendarContents() {

        var calendarContents = [];
        
        var clone = _date.clone();
        clone.addMonth(-1);

        for ( var i = 0 ; i < 3 ; i++ ) {
            calendarContents.push(new CalendarContent(clone));
            clone.addMonth(1);
        }

        calendarFramePane.setContents(calendarContents);
    }

    this.resizePane =function() {

        if (paneFrame) {
            paneFrame.style.height = (paneFrame.paner)
        }

        if (calendarFrame) {
            resizeCalendarFrame();
        }
    }

    var CalendarContent = function(date) {

        var __date__ = date.clone();
        // console.log(__date__.toDateString());

        var calendar = document.createElement('div');
        calendar.classList.add('calendar_base');
        calendar.date = __date__.clone(); 

        var table = document.createElement('table');
        table.classList.add('calendar_table');

        var daysHeader = document.createElement('tr');
        daysHeader.classList.add('days_header');
        table.appendChild(daysHeader);

        // Days header
        var aDay = new Date();
        aDay.setSunday();

        var days = [];
        for (var i = 0 ; i < 7 ; i++) {
            days.push(aDay.dayString());
            aDay.addDate(1);
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

        var today = new Date();

        var yearMonth = date.getFullYear() * 12 + date.getMonth();
        __date__.setDate(1);
        
        if (_this.isMondayStart) {
            __date__.setMonday();
        } else {
            __date__.setSunday();
        }

        while ( yearMonth >= __date__.getFullYear() * 12 + __date__.getMonth()) {

            var calRow = document.createElement('tr');
            calRow.classList.add('calendar_row');

            table.appendChild(calRow);

            for ( var i = 0 ; i < 7 ; i++ ) {

                var dateCell = document.createElement('td');
                dateCell.classList.add('calendar_cell');

                if (yearMonth == __date__.getFullYear() * 12 + __date__.getMonth()) {
                    dateCell.innerText = __date__.getDate();
                } else {
                    dateCell.innerText = '';
                    dateCell.classList.add('empty');
                }

                if (__date__.isSameDate(today)) {
                    dateCell.classList.add('today');
                }

                dateCell.id = DATE_CELL_PREFIX + __date__.getTime();
                dateCell.blink = new elementsEffect.Blink(dateCell);
                dateCell.addEventListener('click', onClickDateCell);

                calRow.appendChild(dateCell);
                __date__.addDate(1);
            }

            // console.log(cal.toDateString());
            
        }


        calendar.appendChild(table);

        // var dateString = document.createElement('div');
        // $(dateString).css({
        //     position : 'absolute',
        //     fontSize : '15px',
        //     top : 0,
        //     left : 0
        // });
        // dateString.innerText = calendar.date.toDateString();
        // calendar.appendChild(dateString);

        return calendar;
     
    }

    function onClickDateCell(e) {

        var cell = touchEventFilter.getTarget(e, 'calendar_cell');
        var id = cell.id;
        var milliSec = id.substring(DATE_CELL_PREFIX.length);
        var cellDate = new Date();
        cellDate.setTime(milliSec);

        // console.log(cellDate.toDateString());

        if ( typeof _this.onClickDateCell === 'function' ) {
            _this.onClickDateCell(cellDate);
        }

    }

    initialize();
}
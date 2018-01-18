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
        monthText,
        leftButton,
        rightButton,
        calendarFrame,
        calendarFramePane,
        _date = date,
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
        leftButton = elements.getElementByClassName(paneFrame, 'left_button');
        leftButton.addEventListener('click', onLeftClick);
        
    }

    function onLeftClick() {
        elementsEffect.blink(leftButton);
        calendarFramePane.animateToShowLeftContent();
    }

    function initRightButton() {
        rightButton = elements.getElementByClassName(paneFrame, 'right_button');
        rightButton.addEventListener('click', onRightClick);

    }

    function onRightClick() {
        elementsEffect.blink(rightButton);
        calendarFramePane.animateToShowRightContent();
    }


    function refreshMonthText() {
        monthText.innerText = dateTime.monthString(_date);
    }

    function initCalendarFrame() {
        calendarFrame = elements.getElementByClassName(paneFrame, 'calendar_frame');

        resizeCalendarFrame();

        calendarFramePane = new SwipePane(calendarFrame);

        calendarFramePane.onPaneReady = function() {
            setCalendarContents();
        } 
        
        calendarFramePane.onShiftContent = function(centerContent, toLeft) {

            console.log(centerContent.date.toDateString());
            _date = centerContent.date;
            refreshMonthText();

            if (toLeft) {
                // Add right content (next month)

            } else {
                // Add left contetn (last month)

            }
        }
    }

    function resizeCalendarFrame() {
        calendarFrame.style.height = (paneFrame.clientHeight - HEADER_HEIGHT_NUM ) + 'px';
    }

    function setCalendarContents() {

        var calendarContents = [];
        
        var clone = dateTime.clonedDate(_date);
        dateTime.addMonth(clone, -1);

        for ( var i = 0 ; i < 3 ; i++ ) {
            calendarContents.push(new CalendarContent(clone));
            dateTime.addMonth(clone, 1);
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

        var __date__ = dateTime.clonedDate(date);
        // console.log(__date__.toDateString());

        var calendar = document.createElement('div');
        calendar.classList.add('calendar_base');
        calendar.date = dateTime.clonedDate(__date__);

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
        __date__.setDate(1);
        
        if (_this.isMondayStart) {
            dateTime.setMonday(__date__);
        } else {
            dateTime.setSunday(__date__);
        }

        while ( yearMonth >= __date__.getFullYear() * 12 + __date__.getMonth()) {

            var calRow = document.createElement('tr');
            calRow.classList.add('calendar_row');

            table.appendChild(calRow);

            for ( var i = 0 ; i < 7 ; i++ ) {

                var calDT = document.createElement('td');

                if (yearMonth == __date__.getFullYear() * 12 + __date__.getMonth()) {
                    calDT.innerText = __date__.getDate();
                } else {
                    calDT.innerText = '';
                    calDT.classList.add('empty');
                }

                calRow.appendChild(calDT);
                dateTime.addDate(__date__, 1)
            }

            // console.log(cal.toDateString());
            
        }


        calendar.appendChild(table);

        var dateString = document.createElement('div');
        $(dateString).css({
            position : 'absolute',
            fontSize : '15px',
            top : 0,
            left : 0
        });
        dateString.innerText = calendar.date.toDateString();
        calendar.appendChild(dateString);

        return calendar;
     
    }


    initialize();
}
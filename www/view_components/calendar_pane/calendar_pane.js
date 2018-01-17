"use strict"
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.CalendarPane = function(parent, date) {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        viewComponents = returnvisitor.viewComponents,
        SwipePane       = viewComponents.SwipePane,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        dateTime        = common.dateTime,
        paneFrame,
        montText,
        _date = date
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
        });
    }

    function initMontText() {
        montText = elements.getElementByClassName(paneFrame, 'month_text');

        refreshMonthText();
    }

    function refreshMonthText() {
        montText.innerText = dateTime.monthString(_date);
    }

    initialize();
}
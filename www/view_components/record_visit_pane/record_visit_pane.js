'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.recordVisitPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        elements        = common.elements,
        loadFile        = common.loadFile,
        elementsEffect  = common.elementsEffect,
        data            = returnvisitor.data,
        PersonVisit     = data.PersonVisit,
        viewComponents  = returnvisitor.viewComponents,
        PersonVisitCell = viewComponents.PersonVisitCell,
        PlacementCell   = viewComponents.PlacementCell,
        _primaryFrame,
        dateText,
        timeText,
        personSeenSubtitle,
        personContainer,
        addPersonButton,
        plcContainer,
        _secondaryFrame,
        _isPrimaryReady = false,
        _isSecondaryReady = false,
        _onClickDateText,
        _onClickTimeText,
        _onClickAddPerson,
        _onClickPlcButton,
        _onClickCancel,
        FADE_DURATION = 300,
        _visit,
        _persons = []; // Persons ever seen in this place will be loaded to this.

    function _initialize(onReadyCallback, visit) {

        _visit = visit;
        
        // TODO: Load persons ever seen in this place are loaded to _persons.

        loadFile.loadCss('./view_components/record_visit_pane/record_visit_pane.css');
        
        initPrimaryFrame();
        initSecondaryFrame();

        var wait = function() {

            if (_isPrimaryReady && _isSecondaryReady) {
                clearInterval(timerId);
                if ( typeof onReadyCallback === 'function' ) {
                    onReadyCallback();
                }
            }
        };

        var timerId = setInterval(wait, 20);

    }

    function initPrimaryFrame() {
        loadFile.loadHtmlAsElement('./view_components/record_visit_pane/record_visit_pane_primary.html', function(elm){
            _primaryFrame = elm;

            initPrimaryElements();

            _isPrimaryReady = true;
        });
    }

    function initSecondaryFrame() {

        loadFile.loadHtmlAsElement('./view_components/record_visit_pane/record_visit_pane_secondary.html', function(elm){
            _secondaryFrame = elm;

            initSecondaryElements();

            _isSecondaryReady = true;
        });
    }

    function initPrimaryElements() {

        initDateText();
        initTimeText();

        personSeenSubtitle = elements.getElementById(_primaryFrame, 'person_seen_subtitle');
        refreshPersonSeenSubtitle();
        initPersonContainer();
        initAddPersonButton();
    }

    function refreshPersonSeenSubtitle(animated) {

        if (animated) {
            if (_visit.personVisits.length <= 0) {

                $(personSeenSubtitle).animate({
                    height : 0
                }, 200, function(){
                    $(personSeenSubtitle).css({
                        display : 'none',
                        height : 0,
                        margin : 0,
                        visibility : 'hidden'
                    });
                });

            } else {
                $(personSeenSubtitle).css({
                    display : 'block',
                    height : 0,
                    margin : '3px',
                    visibility : 'visible'
                });

                $(personSeenSubtitle).animate({
                    height : '15px'
                }, 200);
            }

        } else {
            if (_visit.personVisits.length <= 0) {
                $(personSeenSubtitle).css({
                    display : 'none',
                    height : 0,
                    margin : 0,
                    visibility : 'hidden'
                });
            } else {
                $(personSeenSubtitle).css({
                    display : 'block',
                    height : '15px',
                    margin : '3px',
                    visibility : 'visible'
                });
            }
        }
    }

    function initAddPersonButton() {
        addPersonButton = elements.getElementById(_primaryFrame, 'add_person_button');
        addPersonButton.blink = new elementsEffect.Blink(addPersonButton);
        addPersonButton.addEventListener('click', onClickAddPersonButton, true);
    }

    function initPersonContainer() {
        personContainer = elements.getElementById(_primaryFrame, 'person_container');
        refreshPersonContainer();

    }

    function refreshPersonContainer() {
        if (_visit.personVisits.length <= 0) {
            $(personContainer).css({
                display : 'none',
                // height : 0,
                // margin : 0
            });
        } else {
            $(personContainer).css({
                display : 'block',
                height : 'auto'
            });
        }
    }

    function onClickAddPersonButton() {

        if ( typeof _onClickAddPerson === 'function' ) {
            _onClickAddPerson(_visit, _persons);
        }

    }

    // function initRoomText() {
    //     roomText = document.getElementById('room_text');
    // }

    // function refreshRoomText() {
    //     if ( _visit.place.category === 'ROOM') {
    //         roomText.style.display = 'block';
    //     } else {
    //         roomText.style.display = 'none';
    //     }
    // }

    function initDateText() {
        dateText = elements.getElementByClassName(_primaryFrame, 'date_text');
        dateText.blink = new elementsEffect.Blink(dateText);
        _refreshDateText();
        dateText.addEventListener('click', onClickDateText);
    }

    function _refreshDateText() {
        dateText.innerText = _visit.dateTime.dateString();
    }

    function onClickDateText() {

        if ( typeof _onClickDateText === 'function' ) {
            _onClickDateText(_visit);
        }
    }

    function initTimeText() {
        timeText = elements.getElementByClassName(_primaryFrame, 'time_text');
        timeText.blink = new elementsEffect.Blink(timeText);
        _refreshTimeText();
        timeText.addEventListener('click', onClickTimeText);
    }

    function _refreshTimeText() {
        timeText.innerText = _visit.dateTime.timeString();
    }

    function onClickTimeText() {

        if ( typeof _onClickTimeText === 'function' ) {
            _onClickTimeText(_visit);
        }
    }

    function _addPersonVisitCell(person) {

        _persons.addData(person);

        var personVisit = new PersonVisit(person);
        _visit.personVisits.push(personVisit);

        refreshPersonSeenSubtitle(true);
        refreshPersonContainer();

        var personVisitCell = new PersonVisitCell(personVisit);

        personVisitCell.appendAndExtract(personContainer);
        personVisitCell.onRemoveCell = function(personVisit) {
            
            _visit.personVisits.removeData(personVisit);

            refreshPersonContainer();
            refreshPersonSeenSubtitle(true);
        };
    }

    function initSecondaryElements() {

        initPlcContainer();
        initPlcButton();
        initOkButton();
        initDeleteButton();
        initCancelButton();
        
    }

    function initPlcContainer() {

        plcContainer = elements.getElementByClassName(_secondaryFrame, 'plc_container');

        refreshPlcContainer();
    }

    function refreshPlcContainer() {

        if (_visit.placements.length <= 0) {
            $(plcContainer).css({
                display : 'none',
                // height : 0,
                // margin : 0
            });
        } else {
            $(plcContainer).css({
                display : 'block',
                height : 'auto'
            });
        }
    }

    function initPlcButton() {
        var plcButton = elements.getElementById(_secondaryFrame, 'plc_button');
        plcButton.blink = new elementsEffect.Blink(plcButton);
        plcButton.addEventListener('click', onClickPlcButton);
    }

    function onClickPlcButton() {

        if ( typeof _onClickPlcButton === 'function' ) {
            _onClickPlcButton(_visit);
        }
    }

    function _addPlcCell(plc) {
        
        _visit.placements.push(plc);
        refreshPlcContainer();
        var plcCell = new PlacementCell(plcContainer, plc);
        plcCell.postCollapseCell = function(plc) {
            _visit.placements.removeData(plc);
            refreshPlcContainer();
        };
    }

    function initOkButton() {

    }

    function initDeleteButton() {

    }

    function initCancelButton() {

        var cancelButton = elements.getElementByClassName(_secondaryFrame, 'cancel_button');
        new elementsEffect.Blink(cancelButton);

        cancelButton.addEventListener('click', onClickCancel);
    }

    function onClickCancel() {

        if (typeof _onClickCancel === 'function' ) {
            _onClickCancel();
        }
    }

    // function fadeOutPanes(callback, param) {

    //     var isPrimaryFaded = false, 
    //         isSecondaryFaded = false;

    //     $(_primaryFrame).fadeTo(FADE_DURATION, 0, function(){

    //         _primaryFrame.parentNode.removeChild(_primaryFrame);
    //         isPrimaryFaded = true;

    //     });

    //     $(_secondaryFrame).fadeTo(FADE_DURATION, 0, function(){

    //         _secondaryFrame.parentNode.removeChild(_secondaryFrame);
    //         isSecondaryFaded = true;

    //     });

    //     var wait = function() {

    //         if (isPrimaryFaded && isSecondaryFaded) {
    //             clearInterval(timerId);
    //             callback(param);
    //         }
    //     };

    //     var timerId = setInterval(wait, 20);

    // }

    return {
        initialize : _initialize,

        get primaryFrame() {
            return _primaryFrame;
        },

        get secondaryFrame() {
            return _secondaryFrame;
        },

        set onClickDateText(f) {
            _onClickDateText = f;
        }, 
        refreshDateText : _refreshDateText,

        set onClickTimeText(f) {
            _onClickTimeText = f;
        },
        refreshTimeText : _refreshTimeText,

        set onClickAddPerson(f) {
            _onClickAddPerson = f;
        },

        addPersonVisitCell : _addPersonVisitCell,

        set onClickPlcButton(f) {
            _onClickPlcButton = f;
        },
        addPlcCell : _addPlcCell,

        set onClickCancel(f) {
            _onClickCancel = f;
        }

    };

})();
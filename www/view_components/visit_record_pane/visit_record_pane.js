'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.viewComponents.visitRecordPane = (function(){

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common          = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        dbHelper        = common.dbHelper,
        waiter          = common.waiter,
        raterColors     = common.raterColors,
        elementsEffect  = common.elementsEffect,
        touchEventFilter = common.touchEventFilter,
        data            = returnvisitor.data,
        Visit           = data.Visit,
        Person          = data.Person,
        viewComponents  = returnvisitor.viewComponents,
        SmallSquareButton = viewComponents.SmallSquareButton,
        _primaryFrame,
        roomRow,
        roomText,
        dateTimeText,
        personContainer,
        placementContainer,
        visitNote,
        _secondaryFrame,
        visitRecordList,
        _isPrimaryReady,
        _isSecondaryReady,
        _place,
        _visits,
        _selectedIndex = 0,
        _onClickRecordVisit,
        _onClickEditVisit,
        VISIT_RECORD_CELL_PREFIX = 'visit_record_cell_'
    
    loadFile.loadCss('./view_components/visit_record_pane/visit_record_pane.css');
    loadFile.loadHtmlAsElement('./view_components/visit_record_pane/visit_record_pane_primary.html', function(elm){
        _primaryFrame = elm;

        initPrimaryElements();
        initRecordVisitButton();
        initEditButton();

        _isPrimaryReady = true;
    });

    loadFile.loadHtmlAsElement('./view_components/visit_record_pane/visit_record_pane_secondary.html', function(elm){
        _secondaryFrame = elm;

        initSecondaryElements();

        _isSecondaryReady = true;
    });

    function initPrimaryElements() {

        roomRow = elements.getElementByClassName(_primaryFrame, 'room_row');
        roomText = elements.getElementByClassName(_primaryFrame, 'room_text');
        dateTimeText = elements.getElementByClassName(_primaryFrame, 'date_time_text');
        personContainer = elements.getElementByClassName(_primaryFrame, 'person_container');
        placementContainer = elements.getElementByClassName(_primaryFrame, 'placement_container');
        visitNote   = elements.getElementByClassName(_primaryFrame, 'visit_note');

    }

    function initEditButton() {
        var editButtonBase = elements.getElementByClassName(_primaryFrame, 'edit_button_base');

        var editButton = new SmallSquareButton(editButtonBase, './view_components/edit_button/edit_button.html', './view_components/edit_button/edit_button.css');

        editButton.onClickButton = function() {

            if ( typeof _onClickEditVisit === 'function' ) {
                _onClickEditVisit(_visits[_selectedIndex]);
            }
        };
    }


    function refreshRoomRow() {

        if (_place.category === 'room' ) {
            roomRow.style.display = 'block';
        }  else {
            roomRow.style.display = 'none';
        }
    }

    function refreshRoomText() {
        
        if (_place.category === 'room') {
            roomText.innerText = _place.name;
        }
    }

    function refreshDateTimeText() {

        dateTimeText.innerText = _visits[_selectedIndex].dateTime.dateTimeString();
    }

    function refreshPersonContainer() {
        
        while(personContainer.firstChild) {
            personContainer.removeChild(personContainer.firstChild);
        }
        for (var i = 0 ; i < _visits[_selectedIndex].personVisits.length ; i++ ) {
            generatePesonCell(_visits[_selectedIndex].personVisits[i], function(cell){
                personContainer.appendChild(cell);
            });
        }
    }

    function refreshPlacementContainer() {
        
        while(placementContainer.firstChild) {
            placementContainer.removeChild(placementContainer.firstChild);
        }

        for (var i = 0 ; i < _visits[_selectedIndex].placements.length ; i++ ) {
            generatePlacementCell(_visits[_selectedIndex].placements[i], function(cell) {
                placementContainer.appendChild(cell);
            });
        }
    }

    function refreshVisitNote() {
        
        if (_visits[_selectedIndex].note && _visits[_selectedIndex].note.length > 0) {
            visitNote.style.display = 'block';
            visitNote.innerText = _visits[_selectedIndex].note;

        } else {
            visitNote.style.display = 'none';
        }
    }

    function initRecordVisitButton() {
        var recordVisitButton = elements.getElementByClassName(_primaryFrame, 'record_visit_button');
        new elementsEffect.Blink(recordVisitButton);
        recordVisitButton.addEventListener('click', onClickRecordVisitButton);
    }

    function onClickRecordVisitButton() {

        if ( typeof _onClickRecordVisit === 'function' ) {
            _onClickRecordVisit();
        }
    }


    function initSecondaryElements() {

        visitRecordList = elements.getElementByClassName(_secondaryFrame, 'visit_record_list');

    }

    function refreshVisitRecordList() {

        visitRecordList.innerHtml = '';
        
        for (var i = 0 ; i < _visits.length ; i++ ) {

            generateVisitRecordCell(_visits[i], i, function(cell){
                visitRecordList.appendChild(cell);
            });
        }

        waiter.wait(function(){
            visitRecordList.children[_selectedIndex].style.backgroundColor = 'lightgray';
        }, function(){
            return _visits.length == visitRecordList.children.length; 
        });
    }

    function generateVisitRecordCell(visit, index, callback) {

        loadFile.loadHtmlAsElement('./view_components/visit_record_pane/visit_record_cell.html', function(cell) {

            var mark = elements.getElementByClassName(cell, 'button_mark');
            mark.style.backgroundColor = raterColors.interestColors[Person.interest.indexOfKey(visit.interest)];

            var dateTimeText = elements.getElementByClassName(cell, 'date_time_text');
            dateTimeText.innerText = visit.dateTime.dateTimeString();

            cell.id = VISIT_RECORD_CELL_PREFIX + index;
            cell.addEventListener('click', onClickRecordVisitCell);
            callback(cell);
        });
    }

    function onClickRecordVisitCell(e) {

        var id = touchEventFilter.getTargetId(e, 'visit_record_cell');
        var index = id.substring(VISIT_RECORD_CELL_PREFIX.length);

        var cells = visitRecordList.children;

        for (var i = 0 ; i < cells.length ; i++) {
            if (i == index) {
                cells[i].style.backgroundColor = 'lightgray';
            } else {
                cells[i].style.backgroundColor = 'whitesmoke';
            }
        }

        _selectedIndex = index;
        refreshVisitDetailPane();
        
    }
    
    function _initialize(callback, place) {

        _place = place;
        _visits = [];

        waiter.wait(function(){
            doInitialize(callback);
        }, function(){
            return _isPrimaryReady && _isSecondaryReady;
        });
    }

    function refreshVisitDetailPane() {

        refreshDateTimeText();
        refreshPersonContainer();
        refreshPlacementContainer();
        refreshVisitNote();
    }

    function doInitialize(callback) {
        refreshRoomRow();
        refreshRoomText();

        dbHelper.loadAllVisitsToPlace(_place, function(rows){

            for (var i = 0 ; rows.length > i ; i++ ) {
                Visit.fromDBData(rows.item(i), function(visit){
                    _visits.push(visit);
                });
            }

            waiter.wait(function(){

                if (_visits.length <= 0) {
                    callback();
                    return;
                }
    
                _visits.sort(function(v1, v2){
                    return v2.dateTime.getTime() - v1.dateTime.getTime();
                });
    
        
                refreshVisitDetailPane();
                refreshVisitRecordList();
    
                if (typeof callback === 'function' ) {
                    callback();
                }
            }, function(){
                return rows.length == _visits.length;
            });
        });
    }

    function generatePesonCell(personVisit, callback) {

        loadFile.loadHtmlAsElement('./view_components/visit_record_pane/person_cell.html', function(cell){

            var mark = elements.getElementByClassName(cell, 'button_mark');
            mark.style.backgroundColor = raterColors.interestColors[Person.interest.indexOfKey(personVisit.person.interest)];

            var personData = elements.getElementByClassName(cell, 'person_data');
            personData.style.width = (_primaryFrame.clientWidth - 130) + 'px';
            personData.innerText = personVisit.person.data;

            var rvDiv = elements.getElementByClassName(cell, 'rv_div');
            if (personData.isRV) {
                rvDiv.style.display = 'block';
            } else {
                rvDiv.style.display = 'none';
            }

            var stDiv = elements.getElementByClassName(cell, 'st_div');
            if (personData.isSt) {
                stDiv.style.display = 'block';
            } else {
                stDiv.style.display = 'none';
            }

            callback(cell);
        });
    }

    function generatePlacementCell(placement, callback) {

        var cell = document.createElement('div');
        cell.classList.add('placement_cell');
        cell.innerText = placement.publication.data;
        callback(cell);
    }

    return {

        initialize : _initialize,
        get primaryFrame() {
            return _primaryFrame;
        },
        get secondaryFrame() {
            return _secondaryFrame;
        },

        set onClickRecordVisit(f) {
            _onClickRecordVisit = f;
        },

        set onClickEditVisit(f) {
            f = _onClickEditVisit = f;
        }

    };
})();
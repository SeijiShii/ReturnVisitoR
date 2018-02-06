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
        data            = returnvisitor.data,
        Visit           = data.Visit,
        Person          = data.Person,
        _primaryFrame,
        roomRow,
        roomText,
        dateTimeText,
        personContainer,
        placementContainer,
        visitNote,
        _secondaryFrame,
        _isPrimaryReady,
        _isSecondaryReady,
        _place,
        _visits;
    
    loadFile.loadCss('./view_components/visit_record_pane/visit_record_pane.css');
    loadFile.loadHtmlAsElement('./view_components/visit_record_pane/visit_record_pane_primary.html', function(elm){
        _primaryFrame = elm;

        initPrimaryElements();

        _isPrimaryReady = true;
    });

    loadFile.loadHtmlAsElement('./view_components/visit_record_pane/visit_record_pane_secondary.html', function(elm){
        _secondaryFrame = elm;

        _isSecondaryReady = true;
    });

    function initPrimaryElements() {

        roomRow = elements.getElementByClassName(_primaryFrame, 'room_row');
        roomText = elements.getElementByClassName(_primaryFrame, 'room_text');
        dateTimeText = elements.getElementByClassName(_primaryFrame, 'date_time_text');
        personContainer = elements.getElementByClassName(_primaryFrame, 'person_container');
        placementContainer = elements.getElementByClassName(_primaryFrame, 'placement_container');

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

        dateTimeText.innerText = _visits[0].dateTime.dateTimeString();
    }

    function refreshPersonContainer() {
        
        personContainer.innerHtml = '';
        for (var i = 0 ; i < _visits[0].personVisits.length ; i++ ) {
            generatePesonCell(_visits[0].personVisits[i], function(cell){
                personContainer.appendChild(cell);
            });
        }
    }


    function initSecondaryElements() {

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
                    return v1.dateTime.getTime() - v2.dateTime.getTime();
                });
    
                refreshDateTimeText();
                refreshPersonContainer();
    
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
            mark.style.backgroundColor = raterColors[Person.interest.indexOfKey(personVisit.person.interest)];

            var personData = elements.getElementByClassName(cell, 'person_data');
            personData.style.width = (_primaryFrame.clientWidth - 130) + 'px';
            personData.innerText = personVisit.person.data;

            // var rvDiv = elements.getElementByClassName(cell, 'rv_div');
            // if (personData.isRV) {
            //     rvDiv.style.display = 'block';
            // } else {
            //     rvDiv.style.display = 'none';
            // }

            // var stDiv = elements.getElementByClassName(cell, 'st_div');
            // if (personData.isSt) {
            //     stDiv.style.display = 'block';
            // } else {
            //     stDiv.style.display = 'none';
            // }

            callback(cell);
        });
    }

    return {

        initialize : _initialize,
        get primaryFrame() {
            return _primaryFrame;
        },
        get secondaryFrame() {
            return _secondaryFrame;
        }

    };
})();
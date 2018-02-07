'use strict';
RETURNVISITOR_APP.namespace('RETURNVISITOR_APP.work.c_kogyo.returnvisitor');
RETURNVISITOR_APP.work.c_kogyo.returnvisitor.placePage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        common = returnvisitor.common,
        loadFile        = common.loadFile,
        elements        = common.elements,
        waiter          = common.waiter,
        elementsEffect  = common.elementsEffect,
        dbHelper        = common.dbHelper,
        viewComponents = returnvisitor.viewComponents,
        mapUtils = returnvisitor.mapUtils,
        data = returnvisitor.data,
        Place = data.Place,
        Visit = data.Visit,
        pageFrame,
        mapPaneBase,
        mapPane,
        addressText,
        placeNameText,
        primaryFrame,
        secondaryFrame,
        okButtonRow,
        deleteButtonRow,
        _pageOptions,
        placeActionPane,
        recordVisitPane,
        visitRecordPane,
        _onCancelClick,
        _onFinishRecordVisit,
        _place,
        _isActionPaneReady,
        _isRecordVisitPaneReady,
        _isVisitRecordPaneReady,
        _visiblePaneName,
        FADE_DURATION = 300,
        addPersonDialog,
        personDialog,
        timePickerDialog,
        datePickerDialog,
        plcDialog;

    function _initialize(onReadyCallback, pageOptions) {

        _pageOptions = pageOptions;
        initPlaceData();
        
        loadFile.loadCss('./pages/place_page/place_page.css');
        loadFile.loadHtmlAsElement('./pages/place_page/place_page.html', function(elm){

            pageFrame = elm;

            initFrames();
            requestReverseGeocoding();
            initMap();

            initOKButton();
            initDeleteButton();
            initCancelButton();

            loadPlaceActionPane();
            loadRecordVisitPane();
            loadVisitRecordPane();
            loadDialogFiles();

            showPanesIfReady();

            if ( typeof onReadyCallback === 'function' ) {
                onReadyCallback();
            }

        });        
    }

    function initFrames() {
            
        addressText     = _getElementById('address_text');
        placeNameText   = _getElementById('place_name_text');
        primaryFrame    = _getElementById('primary_frame');
        secondaryFrame  = _getElementById('secondary_frame');
        okButtonRow     = _getElementById('ok_button_row');
        deleteButtonRow = _getElementById('delete_button_row');
    }

    function initMap() {

        mapPaneBase = _getElementById('map_pane_base');

        if (cordova.platformId === 'browser') {

            waiter.wait(function(){
                mapPane = new mapUtils.BrowserMapPane(mapPaneBase, false, _pageOptions.latLng);
                mapPane.addTmpMarker(_pageOptions.latLng);
            }, function(){
                return returnvisitor.app.isBrowserMapReady;
            });

        } else {

            mapPane = new mapUtils.NativeMapPane(mapPaneBase, false, _pageOptions.latLng);
            mapPane.addTmpMarker(_pageOptions.latLng);

        }
    }

    function _getElementById(id) {

        return elements.getElementById(pageFrame, id);
    }

    function _getElementByClassName(className) {

        return elements.getElementByClassName(pageFrame, className);
    }

    function isBrowser() {
        return cordova.platformId === 'browser';
    } 

    function loadPlaceActionPane() {

        loadFile.loadScript('./view_components/place_action_pane/place_action_pane.js', function(){
            _isActionPaneReady = true;
        });  
    }

    function initPlaceActionPane() {

        placeActionPane = viewComponents.placeActionPane;
        placeActionPane.initialize(function(frame){
            primaryFrame.appendChild(frame);
            _visiblePaneName = 'place_action_pane';
            refreshButtonRows();
        });

        placeActionPane.onNewPlaceClick = function() {
            
            // Provisionary set category for marker in small map.
            _place.category = 'place';
            fadeOutPanesAndShowNext(initRecordVisitPane);
        };
    }


    function initPlaceData() {
        _place = _pageOptions.place;
        
        if (!_place) {
            // Provisionary set place category for new.
            _place = new Place(_pageOptions.latLng, 'place');
        }
    }

    function refreshAddressText() {

        addressText.value = _place.address;
    }

    function requestReverseGeocoding() {

        if (_place.address) {
            return;
        }

        // Latitude, longitude -> address
        plugin.google.maps.Geocoder.geocode({
            'position': _place.latLng
        }, function(results) {

            if (results.length === 0) {
                // Not found
                return;
            }

            // console.dir(results);

            var address = results[0].extra.lines[0];
            if (!address) {
                [
                    results[0].subThoroughfare || '',
                    results[0].thoroughfare || '',
                    results[0].locality || '',
                    results[0].adminArea || '',
                    results[0].postalCode || '',
                    results[0].country || ''].join(', ');
            }

            _place.address = address;
            refreshAddressText();

        });
    }

    function fadeOutPanesAndShowNext(showNextPaneFunc) {

        var primaryReady = false,
            secondaryReady = false;

        $(primaryFrame).fadeTo(FADE_DURATION ,0 , function(){
            if (primaryFrame.children.length > 0) {
                primaryFrame.removeChild(primaryFrame.firstChild);
            } 

            primaryReady = true;

        });

        $(secondaryFrame).fadeTo(FADE_DURATION, 0, function(){
            if (secondaryFrame.children.length > 0) {
                secondaryFrame.removeChild(secondaryFrame.firstChild);
            }

            secondaryReady = true;
        });

        waiter.wait(function(){
            showNextPaneFunc();
        }, function(){
            return primaryReady && secondaryReady;
        });
    }

    function fadeInFramesWithContents(contents) {
        primaryFrame.style.opacity = 0;
        secondaryFrame.style.opacity = 0;

        if (contents[0]) {
            primaryFrame.appendChild(contents[0]);
            $(primaryFrame).fadeTo(FADE_DURATION, 1);
        }

        if (contents[1]) {
            secondaryFrame.appendChild(contents[1]);
            $(secondaryFrame).fadeTo(FADE_DURATION, 1);
        }
    }

    function loadRecordVisitPane() {

        loadFile.loadScript('./view_components/record_visit_pane/record_visit_pane.js', function(){
            _isRecordVisitPaneReady = true;
        });
    }

    function initRecordVisitPane() {

        recordVisitPane = viewComponents.recordVisitPane;

        recordVisitPane.initialize(function(){
            fadeInFramesWithContents([
                recordVisitPane.primaryFrame,
                recordVisitPane.secondaryFrame
            ]);
            _visiblePaneName = 'record_visit_pane_for_new';
            refreshButtonRows();
        }, _place);

        recordVisitPane.onClickAddPerson = function(visit, persons) {

            initAddPersonDialog(visit, persons);
        };

        recordVisitPane.onClickDateText = function(visit) {

            initDatePickerDialog(visit);

        };

        recordVisitPane.onClickTimeText = function(visit) {

            initTimePickerDialog(visit);

        };

        recordVisitPane.onClickPlcButton = function(visit) {

            initPlcDialog(visit);
        };

        recordVisitPane.onRefreshInterest = function(interest) {
            mapPane.refreshTmpMarker(interest);
        };

        // recordVisitPane.onClickOk = function(visit) {

        //     if (typeof _onFinishRecordVisit === 'function' ) {
        //         _onFinishRecordVisit(visit.place, visit.interest);
        //     }
        // };
    }

    function loadVisitRecordPane() {
        loadFile.loadScript('./view_components/visit_record_pane/visit_record_pane.js', function(){
            _isVisitRecordPaneReady = true;
        });
    }

    function initVisitRecordPane() {
        visitRecordPane = viewComponents.visitRecordPane;
        visitRecordPane.initialize(function(){
            fadeInFramesWithContents([
                visitRecordPane.primaryFrame,
                visitRecordPane.secondaryFrame
            ]);
            _visiblePaneName = 'visit_record_pane';
            refreshButtonRows();
        }, _place);

        visitRecordPane.onClickRecordVisit = function() {
            fadeOutPanesAndShowNext(initRecordVisitPane);
        };
    }

    function showPanesIfReady() {
        
        switch(_pageOptions.action) {
        case 'new_place_action':
            waiter.wait(initPlaceActionPane, function(){
                return _isActionPaneReady;
            });
            break;

        case 'recorded_place_action':
            waiter.wait(initVisitRecordPane, function(){
                return _isVisitRecordPaneReady;
            });

            break;
        }
    }

    function refreshButtonRows() {

        switch(_visiblePaneName){
        case 'place_action_pane':
            refreshOKButtonRow(false);
            refreshDeleteButtonRow(false);
            break;

        case 'record_visit_pane_for_new':
            refreshOKButtonRow(true);
            refreshDeleteButtonRow(false);
            break;

        case 'visit_record_pane':
            refreshOKButtonRow(false);
            refreshDeleteButtonRow(false);
        }
    }

    function initOKButton() {
        var okButton = _getElementByClassName('ok_button');
        new elementsEffect.Blink(okButton);
        okButton.addEventListener('click', onClickOKButton);
    }

    function onClickOKButton() {

        switch(_visiblePaneName) {
        case 'record_visit_pane_for_new':
            var visit = recordVisitPane.getVisit();
            dbHelper.saveVisit(visit, function() {
                // By using callback pattern, make sure visit data is saved before going next step.
                if (typeof _onFinishRecordVisit === 'function' ) {
                    _onFinishRecordVisit();
                }
    
            });
            break;
        }

    }

    function initDeleteButton() {
        var deleteButton = _getElementByClassName('delete_button');
        new elementsEffect.Blink(deleteButton);
        deleteButton.addEventListener('click', onClickDeleteButton);
    }

    function onClickDeleteButton() {

    }

    function initCancelButton() {
        var cancelButton = _getElementByClassName('cancel_button');
        new elementsEffect.Blink(cancelButton);
        cancelButton.addEventListener('click', onClickCancelButton);
    }

    function onClickCancelButton() {

        switch(_visiblePaneName) {
        case 'place_action_pane':
            if ( typeof _onCancelClick === 'function' ) {
                _onCancelClick();
            }
            break;

        case 'record_visit_pane_for_new':
            fadeOutPanesAndShowNext(function(){
                fadeInFramesWithContents([placeActionPane.paneFrame]);
                _visiblePaneName = 'place_action_pane';
                refreshButtonRows();
            });
            break;

        case 'visit_record_pane':
            if ( typeof _onCancelClick === 'function' ) {
                _onCancelClick();
            }
            break;
        }


    }

    function refreshOKButtonRow(show) {
        
        if (show) {
            okButtonRow.style.display = 'block';
        } else {
            okButtonRow.style.display = 'none';
        }
    }

    function refreshDeleteButtonRow(show) {

        if (show) {
            deleteButtonRow.style.display = 'block';
        } else {
            deleteButtonRow.style.display = 'none';
        }
    }

    // Dialogs

    function loadDialogFiles() {
        loadFile.loadScript('./dialogs/dialog_base/dialog_base.js', function(){
            loadAddPersonDialogScript();
            loadPersonDialogScript();
            loadDatePickerScript();
            loadTimePickerScript();
            loadPlcDialogScript();
        });
    }

    function loadAddPersonDialogScript() {
        loadFile.loadScript('./dialogs/add_person_dialog/add_person_dialog.js', function(){
            //
        });
    }

    function initAddPersonDialog(visit, persons) {

        var blockedPersonIds = [];
        for (var i = 0 ; i < visit.personVisits.length ; i++ ) {
            blockedPersonIds.push(visit.personVisits[i].person.id);
        }

        addPersonDialog = new returnvisitor.AddPersonDialog(persons, blockedPersonIds);
        addPersonDialog.onNewPersonClick = function() {
            initPersonDialog();
        };

        addPersonDialog.onClickPersonCell = function(person) {
            recordVisitPane.addPersonVisitCell(person);
        };
    }

    function initPersonDialog() {
        personDialog = new returnvisitor.PersonDialog();
        personDialog.onClickOk = function(person) {

            recordVisitPane.addPersonVisitCell(person);
        };
    }

    function loadPersonDialogScript() {
        loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
            
            // TEST
            // initPersonDialog();
        });
    }

    function loadDatePickerScript() {
        loadFile.loadScript('./dialogs/date_picker_dialog/date_picker_dialog.js', function(){
            
            // TEST
            // initDatePickerDialog();

        });
    }

    function initDatePickerDialog(visit) {
        datePickerDialog = new returnvisitor.DatePickerDialog(visit.dateTime);
        datePickerDialog.onClickDateCell = function(date) {
            visit.dateTime = date;
            recordVisitPane.refreshDateText();
        };
    }

    function loadTimePickerScript() {
        loadFile.loadScript('./dialogs/time_picker_dialog/time_picker_dialog.js', function(){
            
            // TEST
            // initTimePickerDialog();

        });
    }

    function initTimePickerDialog(visit) {
        timePickerDialog = new returnvisitor.TimePickerDialog(visit.dateTime);
        timePickerDialog.onSetTime = function(time) {
            visit.dateTime = time;
            recordVisitPane.refreshTimeText();
        };
    }

    function loadPlcDialogScript() {
        loadFile.loadScript('./dialogs/placement_dialog/placement_dialog.js', function(){
            
            // TEST
            // initPlcDialog();

        });
    }

    function initPlcDialog() {

        plcDialog = new returnvisitor.PlacementDialog();
        plcDialog.onCreatePlacement = function(plc) {

            // console.log(plc);

            recordVisitPane.addPlcCell(plc);
        };
    }

    return {
        initialize          : _initialize,
        get pageFrame() {
            return pageFrame;
        },

        fireMapReloadIfNeeded : function(){
            if (isBrowser()) {
                initMap();
            }
        },

        set onCancelClick(f) {

            _onCancelClick = f;
        },

        set onFinishRecordVisit(f) {
            _onFinishRecordVisit = f;
        }
    };

})();
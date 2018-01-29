
'use strict';

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        Place = returnvisitor.data.Place,
        Visit = returnvisitor.data.Visit,
        PersonVisit = returnvisitor.data.PersonVisit,
        viewComponents = returnvisitor.viewComponents,
        PersonVisitCell = viewComponents.PersonVisitCell,
        common = returnvisitor.common,
        elements = common.elements,
        elementsEffect = common.elementsEffect,
        dbHelper = common.dbHelper,
        // logoButton,
        // addressText,
        // nameText,
        roomText,
        dateText,
        timeText,
        personVisitSubtitle,
        personContainer,
        _isPersonContainerReady = false,
        addPersonButton,
        _visit,
        _options,
        _onOkClicked,
        addPersonDialog,
        personDialog,
        datePickerDialog,
        timePickerDialog,
        appFrame = document.getElementById('app_frame'),
        _beforeFadeOutPage;
    
    function initVisitData() {

        var place;

        if (_options.method === 'NEW_PLACE_VISIT') {
            place = new Place(_options.latLng, 'PLACE');
        }
        _visit = new Visit(place);

    }
    
    // function initLogoButton() {
    //     logoButton = document.getElementById('logo_button');
    //     logoButton.addEventListener('click', onClickLogoButton);
    // }

    // function onClickLogoButton() {
    //     fadeOut();
    // }


    // function initAddressText() {
    //     addressText = document.getElementById('address_text');
    // }

    // function requestReverseGeocoding() {

    //     if (_visit.place.address) {
    //         return;
    //     }

    //     // Latitude, longitude -> address
    //     plugin.google.maps.Geocoder.geocode({
    //         'position': _visit.place.latLng
    //     }, function(results) {

    //         if (results.length === 0) {
    //             // Not found
    //             return;
    //         }

    //         // console.dir(results);

    //         var address = results[0].extra.lines[0];
    //         if (!address) {
    //             [
    //                 results[0].subThoroughfare || '',
    //                 results[0].thoroughfare || '',
    //                 results[0].locality || '',
    //                 results[0].adminArea || '',
    //                 results[0].postalCode || '',
    //                 results[0].country || ''].join(', ');
    //         }

    //         addressText.value = address;
    //         _visit.place.address = address;

    //     });
    // }

    // function initPersonVisitText() {
    //     personVisitSubtitle = document.getElementById('person_seen_subtitle');
    // }

    // function refreshPersonVisitText(animated) {

    //     if (animated) {
    //         if (_visit.personVisits.length <= 0) {

    //             $(personVisitSubtitle).animate({
    //                 height : 0
    //             }, 200, function(){
    //                 $(personVisitSubtitle).css({
    //                     // display : 'none',
    //                     height : 0,
    //                     margin : 0,
    //                     visibility : 'hidden'
    //                 });
    //             });

    //         } else {
    //             $(personVisitSubtitle).css({
    //                 display : 'block',
    //                 height : 0,
    //                 margin : '3px'
    //             });

    //             $(personVisitSubtitle).animate({
    //                 height : '15px'
    //             }, 200);
    //         }

    //     } else {
    //         if (_visit.personVisits.length <= 0) {
    //             $(personVisitSubtitle).css({
    //                 // display : 'none',
    //                 height : 0,
    //                 margin : 0,
    //                 visibility : 'hidden'
    //             });
    //         } else {
    //             $(personVisitSubtitle).css({
    //                 display : 'block',
    //                 height : '15px',
    //                 margin : '3px'
    //             });
    //         }
    //     }
    // }

    // function initAddPersonButton() {
    //     addPersonButton = document.getElementById('add_person_button');
    //     addPersonButton.addEventListener('click', onClickAddPersonButton, true);
    // }

    // function initPersonContainer() {
    //     personContainer = document.getElementById('person_container');
    //     _isPersonContainerReady = true;

    // }

    // function refreshPersonContainer() {
    //     if (_visit.personVisits.length <= 0) {
    //         $(personContainer).css({
    //             display : 'none',
    //             // height : 0,
    //             // margin : 0
    //         });
    //     } else {
    //         $(personContainer).css({
    //             display : 'block',
    //             height : 'auto'
    //         });
    //     }
    // }

    // function onClickAddPersonButton() {

    //     initAddPersonDialog();
    // }

    function initRoomText() {
        roomText = document.getElementById('room_text');
    }

    function refreshRoomText() {
        if ( _visit.place.category === 'ROOM') {
            roomText.style.display = 'block';
        } else {
            roomText.style.display = 'none';
        }
    }

    // function initDateText() {
    //     dateText = elements.getElementByClassName(appFrame, 'date_text');
    //     dateText.addEventListener('click', onClickDateText);
    // }

    // function refreshDateText() {
    //     dateText.innerText = _visit.dateTime.dateString();
    // }

    // function onClickDateText() {
    //     elementsEffect.blink(dateText);
    //     initDatePickerDialog();
    // }

    // function initTimeText() {
    //     timeText = elements.getElementByClassName(appFrame, 'time_text');
    //     timeText.addEventListener('click', onClickTimeText);
    // }

    // function refreshTimeText() {
    //     timeText.innerText = _visit.dateTime.timeString();
    // }

    // function onClickTimeText() {
    //     elementsEffect.blink(timeText);
    //     initTimePickerDialog();
    // }

    function loadDialogFiles() {
        loadFile.loadScript('./dialogs/dialog_base/dialog_base.js', function(){
            loadAddPersonDialogScript();
            loadPersonDialogScript();
            loadDatePickerScript();
            loadTimePickerScript();
        });
    }

    function loadAddPersonDialogScript() {
        loadFile.loadScript('./dialogs/add_person_dialog/add_person_dialog.js', function(){
            //
        });
    }

    function initAddPersonDialog() {

        var blockedPersonIds = [];
        for (var i = 0 ; i < _visit.personVisits.length ; i++ ) {
            blockedPersonIds.push(_visit.personVisits[i].person.id);
        }

        addPersonDialog = new returnvisitor.AddPersonDialog([], blockedPersonIds);
        addPersonDialog.onNewPersonClick = function() {
            initPersonDialog();
        };

        addPersonDialog.onClickPersonCell = function(person) {
            addPersonToVisit(person);
        };
    }

    function initPersonDialog() {
        personDialog = new returnvisitor.PersonDialog();
        personDialog.onClickOk = function(person) {

            addPersonToVisit(person);
        };
    }

    function addPersonToVisit(person) {

        var personVisit = new PersonVisit(person);
        _visit.personVisits.push(personVisit);
        addPersonVisitCell(personVisit);
    }

    function addPersonVisitCell(personVisit) {

        refreshPersonVisitText(true);
        refreshPersonContainer();

        var personVisitCell = new PersonVisitCell(personVisit);

        personVisitCell.appendAndExtract(personContainer);
        personVisitCell.onRemoveCell = function(personVisit) {
            
            _visit.personVisits.removeData(personVisit);

            refreshPersonContainer();
            refreshPersonVisitText(true);
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

    function initDatePickerDialog() {
        datePickerDialog = new returnvisitor.DatePickerDialog(_visit.dateTime);
        datePickerDialog.onClickDateCell = function(date) {
            _visit.dateTime = date;
            refreshDateText();
        };
    }

    function loadTimePickerScript() {
        loadFile.loadScript('./dialogs/time_picker_dialog/time_picker_dialog.js', function(){
            
            // TEST
            // initTimePickerDialog();

        });
    }

    function initTimePickerDialog() {
        timePickerDialog = new returnvisitor.TimePickerDialog(_visit.dateTime);
        timePickerDialog.onSetTime = function(time) {
            _visit.dateTime = time;
            refreshTimeText();
        };
    }

    function initOkButton() {

        var okButton = document.getElementById('ok_button');
        okButton.addEventListener('click', onClickOkButton, true);
    }

    function onClickOkButton() {

        dbHelper.updateVisit(_visit);
        fadeOut(_onOkClicked, _visit.place);
    }

    function initCancelButton() {

        var cancelButton = document.getElementById('cancel_button');
        cancelButton.addEventListener('click', onClickCancelButton);
    }

    function onClickCancelButton() {

        fadeOut();
    }

    function fadeIn(postFadeIn) {

        var $pageFrame = $('#record_visit_page_frame');

        $pageFrame.css({
            width : '100%',
            height : '100%'
        });
        $pageFrame.fadeTo('slow', 1, function(){
            
            if ( typeof postFadeIn === 'function' ) {
                postFadeIn();
            }
        });
    }

    function fadeOut(callback, arg) {

        if ( typeof _beforeFadeOutPage === 'function' ) {
            _beforeFadeOutPage();
        }

        var $pageFrame = $('#record_visit_page_frame');

        $pageFrame.fadeTo('slow', 0, function(){
            $pageFrame.css({
                width : 0,
            });

            if ( typeof callback === 'function' ) {
                callback(arg);
            }
        });
    }


    // initAddressText();
    // initPersonVisitText();
    initAddPersonButton();
    initRoomText();
    initDateText();
    initTimeText();
    initPersonContainer();

    // initLogoButton();
    initOkButton();
    initCancelButton();

    loadDialogFiles();

    return {

        initialize : function(options, postFadeIn) {

            _options = options;

            initVisitData();

            // requestReverseGeocoding();
            refreshRoomText();
            refreshDateText();
            refreshTimeText();
            refreshPersonVisitText(false);
            refreshPersonContainer();

            var timer = function() {
                if (_isPersonContainerReady) {
                    clearInterval(timerId);
                    fadeIn(postFadeIn);

                } else {
                    // console.log('Waiting for person container ready.')
                }
            };

            var timerId = setInterval(timer, 50);

        },

        refreshElements : function() {
            if (datePickerDialog) {
                datePickerDialog.refreshDialogHeight();
            }
        },

        set onOkClicked(f) {
            _onOkClicked = f;
        },

        set beforeFadeOutPage(f) {
            _beforeFadeOutPage = f;
        }
    };
}());


"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        Place = returnvisitor.data.Place,
        Visit = returnvisitor.data.Visit,
        PersonVisit = returnvisitor.data.PersonVisit,
        viewComponents = returnvisitor.viewComponents,
        PersonVisitCell = viewComponents.PersonVisitCell,
        logoButton,
        addressText,
        nameText,
        roomText,
        personVisitSubtitle,
        personContainer,
        _isPersonContainerReady = false,
        addPersonButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LOGO_BUTTON_SIZE = '40px',
        ROOM_TEXT_HEIGHT = '30px',
        _place,
        _visit,
        _everSeenPersons,
        _personVisits,
        _options,
        addPersonDialog,
        personDialog,
        appFrame = document.getElementById('app_frame');
    
    function initPlaceData() {

        if (_options.method === 'NEW_PLACE_VISIT') {
            _place = new Place(_options.latLng, 'PLACE')
        }
    }

    function initVisitData() {
        _visit = new Visit(_place.id);

        _personVisits = [];
    }

    function initPersons() {
        _everSeenPersons = [];
    }
        
    
    function initLogoButton() {
        logoButton = document.getElementById('logo_button');
        logoButton.addEventListener('click', onClickLogoButton);
    };

    function onClickLogoButton() {

    }


    function initAddressText() {
        addressText = document.getElementById('address_text');
    }

    function requestReverseGeocoding() {

        if (_place.address) {
            return;
        }

        // Latitude, longitude -> address
        plugin.google.maps.Geocoder.geocode({
            "position": _place.latLng
          }, function(results) {
  
            if (results.length === 0) {
              // Not found
              return;
            }
  
            // console.dir(results);

            var address = results[0].extra.lines[0];
            if (!address) {
                [
                results[0].subThoroughfare || "",
                results[0].thoroughfare || "",
                results[0].locality || "",
                results[0].adminArea || "",
                results[0].postalCode || "",
                results[0].country || ""].join(", ");
            }

            addressText.value = address;
            _place.address = address;

          });
    }

    function initPersonVisitSubtitle() {
        personVisitSubtitle = document.getElementById('person_seen_subtitle');
    }

    function refreshPersonVisitSubtitle(animate) {

        if (animate !== undefined || animate == true) {

        } else {
            if (_visit.personVisitIds.length <= 0) {
                $(personVisitSubtitle).css({
                    display : 'none',
                    height : 0,
                    margin : 0
                });
            } else {
                $(personVisitSubtitle).css({
                    display : 'block',
                    height : '15px',
                    margin : '3px'
                });
            }
        }
    }

    function initAddPersonButton() {
        addPersonButton = document.getElementById('add_person_button');
        addPersonButton.addEventListener('click', onClickAddPersonButton);
    }

    function initPersonContainer() {
        personContainer = document.getElementById('person_container');
        _isPersonContainerReady = true;

    }

    function onClickAddPersonButton() {

        initAddPersonDialog();
    }

    function initRoomText() {
        roomText = document.getElementById('room_text');
    }

    function refreshRoomText() {
        if ( _place.category === 'ROOM') {
            roomText.style.display = 'block';
        } else {
            roomText.style.display = 'none';
        }
    }

    function loadDialogFiles() {
        loadFile.loadScript('./dialogs/dialog_base.js', function(){
            loadAddPersonDialogScript();
            loadPersonDialogScript();
        });
    }

    function loadAddPersonDialogScript() {
        loadFile.loadScript('./dialogs/add_person_dialog/add_person_dialog.js', function(){});
    }

    function initAddPersonDialog() {
        // var persons = [_everSeenPersons];
        // persons.removeByIds(_visit.personVisitIds);

        // console.log(persons);

        var blockedPersonIds = [];
        for (var i = 0 ; i < _personVisits.length ; i++ ) {
            blockedPersonIds.push(_personVisits[i].personId);
        }

        addPersonDialog = new returnvisitor.AddPersonDialog(_everSeenPersons, blockedPersonIds);
        addPersonDialog.onNewPersonClick = function() {
            initPersonDialog();
        };

        addPersonDialog.onClickPersonCell = function(person) {
            addPersonToVisit(person);
        }
    }

    function initPersonDialog() {
        personDialog = new returnvisitor.PersonDialog();
        personDialog.onClickOk = function(person) {
            addPersonToVisit(person);
        } 
    }

    function addPersonToVisit(person) {

        _everSeenPersons.addData(person);
        _place.personIds.addElement(person.id);

        var personVisit = new PersonVisit(person, _visit.id);
        _personVisits.addData(personVisit);
        _visit.personVisitIds.addElement(personVisit.id);

        addPersonVisitCell(personVisit);
    }

    function addPersonVisitCell(person) {
        var personVisitCell = new PersonVisitCell(person);
        // personVisitCell.appendTo(personContainer);
        personVisitCell.appendAndExtract(personContainer);
        personVisitCell.onRemoveCell = function(personVisit) {
            _visit.personVisitIds.splice(_visit.personVisitIds.indexOf(personVisit.id), 1);
            _personVisits.removeById(personVisit.id);
        }
    }

    function loadPersonDialogScript() {
        loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
            
            // TEST
            initPersonDialog();
        });
    }

    function fadeIn() {
        $('#record_visit_page_frame').fadeTo('slow', 1);

    }

    initPersons();

    initAddressText();
    initPersonVisitSubtitle();
    initAddPersonButton();
    initRoomText();
    initPersonContainer();

    loadDialogFiles();

    // test
    // initSwitch();

    return {

        initialize : function(options) {
            _options = options;
            initPlaceData();
            initVisitData();

            requestReverseGeocoding();
            refreshRoomText();
            refreshPersonVisitSubtitle();

            var timer = function() {
                if (_isPersonContainerReady) {
                    clearInterval(timerId);
                    fadeIn();
                } else {
                    console.log('Waiting for person container ready.')
                }
            }

            var timerId = setInterval(timer, 50);
        }
    }
}());


"use strict"

RETURNVISITOR_APP.work.c_kogyo.returnvisitor.recordVisitPage = (function() {

    var returnvisitor = RETURNVISITOR_APP.work.c_kogyo.returnvisitor,
        loadFile = RETURNVISITOR_APP.work.c_kogyo.returnvisitor.common.loadFile,
        Place = returnvisitor.data.Place,
        viewComponents = returnvisitor.viewComponents,
        PersonSeenCell = viewComponents.PersonSeenCell,
        logoButton,
        addressText,
        nameText,
        roomText,
        personSeenSubtitle,
        personContainer,
        _isPersonContainerReady = false,
        addPersonButton,
        AD_FRAME_HEIGHT = 50,
        WIDTH_BREAK_POINT = 500,
        LOGO_BUTTON_SIZE = '40px',
        ROOM_TEXT_HEIGHT = '30px',
        _place,
        _persons,
        _options,
        addPersonDialog,
        personDialog,
        appFrame = document.getElementById('app_frame');
    
    function initPlaceData() {

        if (_options.method === 'NEW_PLACE_VISIT') {
            _place = new Place(_options.latLng, 'PLACE')
        }
    }

    function initPersons() {
        _persons = [];
    }
        
    
    function initLogoButton() {
        // console.log('initLogoButton called!')
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

    function initPersonSeenSubtitle() {
        personSeenSubtitle = document.getElementById('person_seen_subtitle');
    }

    function refreshPersonSeenSubtitle(animate) {

        if (animate !== undefined || animate == true) {

        } else {
            if (_persons.length <= 0) {
                $(personSeenSubtitle).css({
                    display : 'none',
                    height : 0,
                    margin : 0
                });
            } else {
                $(personSeenSubtitle).css({
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

        // var personCell = new PersonSeenCell();
        // personCell.appendTo(personContainer);
        // personCell.appendCallback = function() {
        //     _isPersonContainerReady = true;
        // }
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
        addPersonDialog = new returnvisitor.AddPersonDialog();
        addPersonDialog.onNewPersonClick = function() {
            personDialog = new returnvisitor.PersonDialog();
            personDialog.onClickOk = function(person) {
                console.log(person);
                _persons.push(person);
                addPersonSeenCell(person);
            } 
        };
    }

    function addPersonSeenCell(person) {
        var personSeenCell = new PersonSeenCell(person);
        personSeenCell.appendAndExtract(personContainer);
    }

    function loadPersonDialogScript() {
        loadFile.loadScript('./dialogs/person_dialog/person_dialog.js', function(){
            
        });
    }

    function fadeIn() {
        $('#record_visit_page_frame').fadeTo('slow', 1);

    }

    initPersons();

    initAddressText();
    initPersonSeenSubtitle();
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
            requestReverseGeocoding();
            refreshRoomText();
            refreshPersonSeenSubtitle();

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
